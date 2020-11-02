import { Request, Response } from 'express';

import { axios, cgiUrl, phpUrl } from '@/utils/api';
import { DbService } from '@/services/db';
import {
    WfRequest,
    IDetailParamObj,
    IWarehouseObj,
    ISubletVendors,
    ISublet,
    IVendor,
    IWfResultObj,
    IWfDataObj,
    ISubletCustom,
} from '@/interfaces/response.interface';

export const getDetailParam = async (req: Request, res: Response) => {
    try {
        const companyId = req.query.company_id;
        const dbService: DbService = req.app.locals.dbService;

        let request: WfRequest<IDetailParamObj[]> = dbService
            .getDetailParams({ company_id: companyId })
            .then((details) =>
                details.length === 0
                    ? axios(req).get(cgiUrl, {
                          params: {
                              action: 'get_detail_param',
                              ch_company_id: companyId,
                          },
                      })
                    : { data: details }
            );

        let response = await request;

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

export const getWhParts = async (req: Request, res: Response) => {
    try {
        const companyId = req.query.company_id;
        const dbService: DbService = req.app.locals.dbService;

        let request: WfRequest<IWarehouseObj[]> = dbService
            .getWhParts({ company_id: companyId })
            .then((parts) =>
                parts.length === 0
                    ? axios(req).get(cgiUrl, {
                          params: {
                              action: 'get_warehouse',
                              ch_company_id: req.query.company_id,
                          },
                      })
                    : { data: parts }
            );

        let response = await request;

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

const emptySubletVendors = {
    vendors: [] as IVendor[],
    sublets: [] as ISublet[],
    subl_custom: [] as ISubletCustom[],
};

export const getSubletVendors = async (req: Request, res: Response) => {
    try {
        const companyId = req.query.company_id;
        const dbService: DbService = req.app.locals.dbService;
        let subletVendorsRequest: WfRequest<IWfResultObj<
            IWfDataObj<ISubletVendors>
        >> = dbService
            .getSubletVendors({})
            .toArray()
            .then((configObjs) => {
                return configObjs.length === 0
                    ? axios(req).get(phpUrl, {
                          params: {
                              action: 'get_sublet_vendors',
                              company_id: companyId,
                          },
                      })
                    : {
                          data: {
                              result: {
                                  data: configObjs.reduce((acc, cur) => {
                                      return {
                                          ...acc,
                                          [cur.configName]: cur.configs.filter(
                                              ({ company_id }) =>
                                                  +companyId === +company_id
                                          ),
                                      };
                                  }, emptySubletVendors),
                              },
                          },
                      };
            });

        let subletVendorsResponse = await subletVendorsRequest;

        if (!subletVendorsResponse.data) {
            throw {
                error: subletVendorsResponse.statusText || 'Server error',
                status: subletVendorsResponse.status || 500,
            };
        }

        res.send(subletVendorsResponse.data);
    } catch (err) {
        const { error = 'Server error', status = 500 } = err;
        res.status(status).send(error);
    }
};
