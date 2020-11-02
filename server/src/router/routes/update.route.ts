import { Request, Response } from "express";
import { axios, phpUrl } from "@/utils/api";

export const update = async (req: Request, res: Response) => {
    const io: SocketIO.Server = req.app.get('io');
    const nsp = io.of('/updates');

    const socketId = req.body.wfID;
    const socket = socketId ? nsp.sockets[socketId] : nsp;
    try {
        if (req.body.action === undefined || req.body.data === undefined) {
            throw {
                status: 500,
                error: `No 'action' or/and 'data' property. Request body: ${JSON.stringify(req.body)}`
            };
        }

        let response = await axios(req).get(phpUrl, {
            params: {
                action: 'ping'
            },
        });

        if (!response.data) {
            throw {
                status: response.status || 500,
                error: response.statusText || 'Server error'
            };
        }

        if (!response.data.id) {
            throw {
                status: 403,
                error: 'Session error'
            };
        }
    
        const cid = response.data.user.company_id;
        
        socket.to(cid).emit('update', req.body);
    
        res.json({ success: true });
    } catch ({error, status}) {
        res.status(status).json({ success: false, error });
    }

};
