import Axios, { AxiosResponse, AxiosInstance } from 'axios';
import { Request } from 'express';

export const getIP: (req: Request) => string | undefined = (req: Request) =>
    req.header('x-forwarded-for') || req.connection.remoteAddress;

export const checkResponse = (response: AxiosResponse) => {
    if (response.data.check_auth === false) {
        return Promise.reject({ error: 'No auth', status: 403 });
    }
    return response;
};

export const axios: (reqOrSession?: Request | string) => AxiosInstance = (
    reqOrSession
) => {
    const params =
        typeof reqOrSession !== 'string' && reqOrSession !== undefined
            ? { REMOTE_ADDR: getIP(reqOrSession) }
            : {};
    const session: string | undefined =
        (reqOrSession as Request)?.cookies?.estSession ||
        (reqOrSession as string);

    const instance = Axios.create({
        baseURL: 'https://estvis.com/cgi-bin',
        params,
        headers:
            session !== undefined && session.length !== 0
                ? {
                      cookie: `session=${session}; est_session=${session}`,
                  }
                : {},
    });

    instance.interceptors.response.use(checkResponse);
    return instance;
};

export const phpUrl = '/oas_reg_router.php';
export const cgiUrl = '/oaservice.cgi';
export const webDCApiUrl = 'https://ws.estvis.com';
