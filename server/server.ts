import 'module-alias/register';
import { Server } from 'http';

import appBootstrap from '@/app';
import initSocketIO from '@/socket';
import { updateInterval } from '@config/db.config';
import { DbService } from '@/services/db';

(async () => {
    const PORT = process.env.PORT || 7000;
    const appExpress = await appBootstrap();

    const appServer: Server = appExpress.listen(PORT, () => {
        console.log(`Server started on ${PORT}`);
    });
    
    const { io } = initSocketIO(appServer);
    appExpress.set('io', io);

    const dbService: DbService = appExpress.locals.dbService;
    const intervalID = setInterval(() => dbService.read(), updateInterval);

    appServer.on('close', () => {
        clearInterval(intervalID)
    })
})();
