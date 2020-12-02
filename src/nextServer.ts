const express = require('express');
const next = require('next');
const { Signale } = require('signale');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
// const devProxy = require('./proxy');

export default function (config) {
    /* eslint-disable no-console */

// const dotenv = require('dotenv');

// const routes = require('./routes');

// dotenv.config();
    const env = process.env.NODE_ENV;
    const dev = env !== 'production';
    const prod = !dev;
// const ngrok = isDev && process.env.ENABLE_TUNNEL ? require('ngrok') : null;
// const router = require('./routes');
// const logger = require('./server/logger');

    const customHost = process.env.HOST;
    const host = customHost || null;
    const prettyHost = customHost || 'localhost';
    const port = parseInt(process.env.PORT, 10) || 3000;
    const options = {scope: 'app server'};
    const signale = new Signale(options);
// const publicEnvFilename = 'public.env';

    const app = next({ dev });
    const handle = app.getRequestHandler();


// // share public env variables (if not already set)
// try {
//     if (fs.existsSync(path.resolve(__dirname, publicEnvFilename))) {
//         const publicEnv = dotenv.parse(
//             fs.readFileSync(path.resolve(__dirname, publicEnvFilename))
//         );
//         Object.keys(publicEnv).forEach(key => {
//             if (!process.env[key]) {
//                 process.env[key] = publicEnv[key];
//             }
//         });
//     }
// } catch (err) {
//     // silence is golden
// }
//

    app.prepare().then(() => {
        const server = express();

        // server.use(compression({ threshold: 0 }));
        // server.use(
        //     cors({
        //         origin:
        //             prettyHost.indexOf('http') !== -1 ? prettyHost : `http://${prettyHost}`,
        //         credentials: true
        //     })
        // );

        // if (process.env.PROXY_MODE === "local") {
        //     // eslint-disable-next-line global-require
        //     const proxyMiddleware = require("http-proxy-middleware");
        //     Object.keys(devProxy).forEach(context => {
        //         server.use(proxyMiddleware(context, devProxy[context]));
        //     });
        // }


        server.get('*', (req, res) => handle(req, res));

        server.listen(port, host, err => {
            if (err) throw err

            signale.success(`> Ready on [${env}] http://localhost:${port}`)

            // if (ngrok) {
            //     ngrok.connect(
            //         port,
            //         (innerErr, url) => {
            //             if (innerErr) {
            //                 return logger.error(innerErr);
            //             }
            //             logger.appStarted(port, prettyHost, url);
            //         }
            //     );
            // } else {
            //     logger.appStarted(port, prettyHost);
            // }
        });
    });
}