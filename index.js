const datas = require('./temperatures.json')
const Hapi = require('@hapi/hapi');
const moment = require('moment');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            cors: {
                origin:['*'],
                headers: ["Accept", "Content-Type"],
                additionalHeaders: ["X-Requested-With"]
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/status',
        options: {
            cors: true,
            handler: (request, h) => {
                return 'Temperature Service: ok';
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/lastTemperature',
        options: {
            cors: {origin: ['*']},
            handler: (request, h) => {
                return datas[datas.length - 1]
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/temperaturesByWeek',
        handler: (request, h) => {
            return datas.filter((el)=> {
                return el.date > moment().startOf('week').add(1, 'day').format('YYYY-MM-DD HH:mm:ss') && el.date < moment().endOf('week').add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/temperaturesByMonth',
        handler: (request, h) => {
            return datas.filter((el)=> {
                return el.date > moment().startOf('month').format('YYYY-MM-DD HH:mm:ss') && el.date < moment().endOf('month').format('YYYY-MM-DD HH:mm:ss')
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/allTemperatures',
        handler: (request, h) => {
            return datas;
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();