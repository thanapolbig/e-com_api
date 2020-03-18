const logger = require('./util/logger.js')

async function middleware(req, res, next) {
    logger.info(`[middlewaer : verify API KEY]`)
    var request = require('request');
    var header = req.headers["authorization"];
    console.log(header)

    await request({
        method: 'get',
        uri: 'http://localhost:3000/validate',
        headers: {
            'authorization': header,
        }
    },  (err, httpResponse, body, res) => {
        if (err) {
            logger.error(err);
        } else {
            // res.json({
            //     httpResponse: httpResponse,
            //     body: body
            // });
        }
        next();
    });

}
module.exports = middleware;