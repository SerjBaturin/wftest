import { Request, Response } from "express";
import { axios, cgiUrl, phpUrl } from "@/utils/api";
import * as qs from 'qs';

export const assignUserOnCase = async (req: Request, res: Response) => {
    const { envelope_id, param_name, param_value, company_id, user_id, type, pid } = req.body;
    const request = axios(req);

    try {
        const set_case_param = await request.post(cgiUrl, qs.stringify({
            action: 'set_case_param',
            envelope_id, param_name, param_value
        }));

        if (!set_case_param.data) {
            throw {
                error: set_case_param.statusText,
                status: set_case_param.status
            }
        }

        const response = await request.post(phpUrl, qs.stringify({
            action: 'rab_send',
            data: JSON.stringify({
                action: 'set_btest',
                data: { envelope_id, user_id, type, pid }
            }),
            company_id
        }));

        if (!response.data) {
            throw {
                error: response.statusText,
                status: response.status
            }
        }

        const data = {
            set_case_param: set_case_param.data,
            rab_send: await response.data,
        }

        res.send(data);
    } catch (err) {
        const { error = 'Server error', status = 500 } = err;
        res.status(status).send(error);
    }
};