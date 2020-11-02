import * as SocketIO from 'socket.io';
import { Server } from 'http';
import * as cookie from 'cookie';
import { secret } from '@config/secret';
import Axios, { AxiosResponse } from 'axios';
import { phpUrl, webDCApiUrl } from './utils/api';
import { ICompanyIpList } from './interfaces/response.interface';
import 'promise-any-polyfill';

const initSocketIO = (server: Server) => {
    const io = SocketIO(server);

    io.of('/updates')
        .use((socket, next) => {
            const cookies = cookie.parse(socket.handshake.headers.cookie);
            const token = cookies?.token;

            if (token === undefined && token !== secret) {
                socket.disconnect();
                return next(new Error('Session error'));
            }

            next();
        })
        .on('connection', (socket) => {
            const cid = socket.handshake.query.cid;
            if (cid === undefined || cid === null) {
                socket.disconnect();
                return;
            }

            socket.join(cid);

            const cookie = socket.handshake.headers.cookie;
            const address =
                socket.handshake.headers['x-forwarded-for'] ||
                socket.handshake.address;
            setTimeout(async () => {
                try {
                    let responseData = (
                        await Axios.get<ICompanyIpList>(
                            `https://estvis.com/cgi-bin${phpUrl}`,
                            {
                                headers: { cookie },
                                params: {
                                    action: 'get_ip_list',
                                    comp: cid,
                                    REMOTE_ADDR: address,
                                },
                            }
                        )
                    ).data;

                    let ips = (responseData.data || []).map(({ ip, port }) => ({
                        ip,
                        port,
                    }));

                    const source = Axios.CancelToken.source();

                    let pingRequests = ips.map(({ ip, port }) =>
                        Axios.get(
                            `http${
                                ip.includes('estvis') ? 's' : ''
                            }://${ip}:${port}`,
                            {
                                params: {
                                    action: 'ping',
                                },
                                cancelToken: source.token
                            }
                        ).catch(reason => {
                            if (!Axios.isCancel(reason)) {
                                throw reason;
                            }
                        })
                    );

                    let url = await Promise.any(pingRequests)
                        .then((response) => {
                            source.cancel('Ping resolved');
                            return (response as AxiosResponse).config.url;
                        })
                        .catch(() =>
                            Axios.get(webDCApiUrl, {
                                params: {
                                    action: 'ping',
                                },
                            }).then((response) => response.config.url)
                        );

                    socket.emit('setActiveDC', url || null);
                } catch (error) {
                    socket.emit('setActiveDC', null);
                    throw error;
                }
            }, 0);
        });

    return { io };
};

export default initSocketIO;
