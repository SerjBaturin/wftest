import { Request, Response } from 'express';
import * as qs from 'qs';
import { axios, cgiUrl, phpUrl } from '@/utils/api';
import { parseItemsHistory } from '@/utils/itemsHistory';
import { DbService } from '@/services/db';
import { days } from '@config/db.config';
import {
    ICaseObj,
    ICaseParamObj,
    IStatusConfigObj,
    IWfStat,
    WfRequest,
    IWfResultObj,
    IWfDataObj,
    IInsurance,
    IPrecondition,
} from '@/interfaces/response.interface';

export const getCases = async (req: Request, res: Response) => {
    const request = axios(req);
    try {
        const companyId = req.query.company_id;
        const dbService: DbService = req.app.locals.dbService;

        let casesRequest: WfRequest<IWfResultObj<
            ICaseObj[]
        >> = dbService.getCases({ company_id: companyId }).then((cases) =>
            cases.length === 0
                ? request.get(cgiUrl, {
                      params: {
                          action: 'read_cases',
                          days: req.query.days || days,
                          ch_company_id: companyId,
                      },
                  })
                : { data: { result: cases } }
        );

        let paramsRequest: WfRequest<IWfResultObj<
            IWfDataObj<ICaseParamObj[]>
        >> = dbService.getCaseParams({ company_id: companyId }).then((params) =>
            params.length === 0
                ? request.get(cgiUrl, {
                      params: {
                          action: 'get_case_param',
                          ch_company_id: companyId,
                      },
                  })
                : { data: { result: { data: params } } }
        );

        let configRequest: WfRequest<IWfDataObj<{
            list: IStatusConfigObj[];
        }>> = dbService
            .getStatusConfigs({
                company_id: companyId,
            })
            .then((configs) =>
                configs.length === 0
                    ? request.get(phpUrl, {
                          params: {
                              action: 'get_status_config',
                              company_id: companyId,
                          },
                      })
                    : { data: { data: { list: configs } } }
            );

        let insurancesRequest: WfRequest<{
            insurances: IInsurance[],
            preconditions: IPrecondition[]
        }> = Promise.all([
            dbService.getConfig({ configName: 'Insurances' }),
            dbService.getConfig({ configName: 'Preconditions' }),
        ]).then(([insurances, preconditions]) =>
            insurances === null || preconditions === null
                ? request
                      .get(cgiUrl, {
                          params: {
                              action: 'read_full_config',
                              ch_company_id: companyId,
                          },
                      })
                      .then(({ data }) => ({
                          data: {
                              insurances: data.result.Insurances,
                              preconditions: data.result.Preconditions,
                          },
                      }))
                : {
                      data: {
                          insurances: insurances.configs.filter(
                              ({ company_id }) =>
                                  +company_id === +companyId ||
                                  +company_id === 0
                          ),
                          preconditions: preconditions.configs.filter(
                              ({ company_id }) =>
                                  +company_id === +companyId ||
                                  +company_id === 0
                          ),
                      },
                  }
        );

        let responses = await Promise.all([
            casesRequest,
            paramsRequest,
            configRequest,
            insurancesRequest,
        ]);

        let errorResponse = responses.find((response) => !response.data);
        if (errorResponse !== undefined) {
            throw {
                error: errorResponse.statusText || 'Server error',
                status: errorResponse.status || 500,
            };
        }

        let [
            casesResponse,
            paramsResponse,
            configResponse,
            fullConfigResponse,
        ] = responses;

        let data = {
            cases: casesResponse.data.result,
            params: paramsResponse.data.result,
            config: configResponse.data,
            insurances: fullConfigResponse.data.insurances,
            preconditions: fullConfigResponse.data.preconditions
        };

        res.send(data);
    } catch ({ error, status }) {
        res.status(status).send(error);
    }
};

export const changeCaseStatus = async (req: Request, res: Response) => {
    let {
        date,
        envelope_id,
        from_wf_status,
        to_wf_status,
        user_id,
        company_id,
    }: { [key: string]: string | number } = req.body;
    const request = axios(req);
    try {
        let set_case_param = await request.post(
            cgiUrl,
            qs.stringify({
                action: 'set_case_param',
                envelope_id,
                param_name: 'wf_status',
                param_value: to_wf_status,
            })
        );

        if (!set_case_param.data) {
            throw {
                error: set_case_param.statusText || 'Server error',
                status: set_case_param.status || 500,
            };
        }

        let response = await request.post(
            phpUrl,
            qs.stringify({
                action: 'rab_send',
                data: JSON.stringify({
                    date,
                    action: 'case_update_status',
                    data: {
                        envelope_id,
                        from_wf_status,
                        to_wf_status,
                        user_id,
                    },
                }),
                company_id,
            })
        );

        if (!response.data) {
            throw {
                error: response.statusText || 'Server error',
                status: response.status || 500,
            };
        }

        let data = {
            set_case_params: set_case_param.data,
            rab_send: response.data,
        };

        res.send(data);
    } catch (err) {
        const { error = 'Server error', status = 500 } = err;
        res.status(status).send(error);
    }
};

export const getWfStat = async (req: Request, res: Response) => {
    const request = axios(req);
    try {
        const dbService: DbService = req.app.locals.dbService;
        const companyId = req.query.company_id;

        let wfStatsRequest: WfRequest<IWfStat[]> = dbService
            .getWfStats({ company_id: companyId })
            .then((wfStats) =>
                wfStats.length === 0
                    ? request
                          .get<{ result: { data: IWfStat[] } }>(phpUrl, {
                              params: {
                                  action: 'read_wf_stat',
                                  company_id: req.query.company_id,
                              },
                          })
                          .then(({ data }) => data.result)
                    : { data: wfStats }
            );

        let response = await wfStatsRequest;

        if (!response.data) {
            throw {
                error: response.statusText || 'Server error',
                status: response.status || 500,
            };
        }

        const data: IWfStat[] = response.data;
        const itemsHistory = parseItemsHistory(data);

        res.send(itemsHistory);
    } catch (err) {
        const { error = 'Server error', status = 500 } = err;
        res.status(status).send(error);
    }
};

export const readCase = async (req: Request, res: Response) => {
    try {
        const dbService: DbService = req.app.locals.dbService;
        const envId = req.query.envId;

        let caseRequest: WfRequest<ICaseObj> = dbService
            .getCases({ envelope_id: envId })
            .then((cases) =>
                cases.length === 1
                    ? { data: cases[0] }
                    : axios(req).get(phpUrl, {
                          params: {
                              action: 'mob_readcase',
                              envelope_id: req.query.envId,
                          },
                      })
            );

        let response = await caseRequest;

        if (!response.data) {
            throw {
                error: response.statusText || 'Server error',
                status: response.status || 500,
            };
        }

        res.send(response.data);
    } catch (err) {
        const { error = 'Server error', status = 500 } = err;
        res.status(status).send(error);
    }
};
