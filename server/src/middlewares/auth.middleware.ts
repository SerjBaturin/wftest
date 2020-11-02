import { Request, Response, NextFunction } from "express";

export const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization?.split('Bearer ')[1];
    if (token || Reflect.has(req.cookies, 'est_session') || Reflect.has(req.cookies, 'session')) {
        req.cookies.estSession = token || req.cookies.est_session || req.cookies.session;
        return next();
    }

    return res.status(403).send('No authorization token');
};
