import { Request, Response } from 'express';
import * as qs from 'qs';
import { axios, phpUrl } from '@/utils/api';

const login = async (req: Request, res: Response) => {
    try {
        let authData = {
            action: 'login',
            login: req.body.login,
            passwd: req.body.passwd
        };

        let resp = await axios(req).post(phpUrl, qs.stringify(authData));

        if (!resp.data) {
            throw new Error(`Error: ${resp.statusText}`);
        }
        
        res.send(resp.data);
    } catch (err) {
        res.send(err);
    }
};

export default login;