import { Request, Response } from 'express';
import { axios, phpUrl } from '@/utils/api';
import { DbService } from '@/services/db';
import {
    WfRequest,
    IWfUser,
    IWfResultObj,
    IWfDataObj,
} from '@/interfaces/response.interface';

export const getWfUsers = async (req: Request, res: Response) => {
    try {
        const companyId = req.query.company_id;
        const dbService: DbService = req.app.locals.dbService;

        let wfUsersRequest: WfRequest<IWfUser[]> = dbService
            .getWfUsers({ company_id: companyId })
            .then((wfUsers) =>
                wfUsers.length === 0
                    ? axios(req)
                          .get<IWfResultObj<IWfDataObj<IWfUser[]>>>(phpUrl, {
                              params: {
                                  action: 'get_users_wf',
                                  company_id: companyId,
                              },
                          })
                          .then(({ data }) => data.result)
                    : {
                          data: wfUsers,
                      }
            );

        let wfUsersResponse = await wfUsersRequest;

        if (!wfUsersResponse.data) {
            throw {
                error: wfUsersResponse.statusText,
                status: wfUsersResponse.status,
            };
        }

        res.send(wfUsersResponse.data);
    } catch ({ error, status }) {
        res.status(status || 500).send(error || 'Server error');
    }
};
