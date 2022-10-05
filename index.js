const datas = require('./temperatures.json')
const Hapi = require('@hapi/hapi');

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
                console.log('datas', datas)
                return datas[datas.length - 1]
            }
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