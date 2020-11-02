import { Router } from "express";

import { AuthMiddleware } from '../middlewares/auth.middleware';
import ping from './routes/ping.route';
import login from './routes/login.route';
import { getCases, changeCaseStatus, getWfStat, readCase } from './routes/cases.route';
import { getWfUsers } from "./routes/users.route";
import { assignUserOnCase } from "./routes/assign.route";
import { update } from './routes/update.route';
import { getDetailParam, getWhParts, getSubletVendors } from "./routes/detail.route";

const router: Router = Router();

router.get('/ping', AuthMiddleware, ping);

router.post('/login', login);

router.route('/cases').get(AuthMiddleware, getCases)
    .post(AuthMiddleware, changeCaseStatus);

router.get('/get-wf-users', AuthMiddleware, getWfUsers);

router.post('/assign-user', AuthMiddleware, assignUserOnCase);

router.post('/update', AuthMiddleware, update);

router.get('/read-wf-stat', AuthMiddleware, getWfStat);

router.get('/read-case', AuthMiddleware, readCase);

router.get('/get-detail-param', AuthMiddleware, getDetailParam);

router.get('/get-wh-parts', AuthMiddleware, getWhParts);

router.get('/get-sublet-vendors', AuthMiddleware, getSubletVendors);

export { router };