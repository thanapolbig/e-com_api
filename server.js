const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const logger = require('./util/logger.js')
app.get('/', (req, res) => {
    res.send('Hi!')
})

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/', require('./router/index'));
const port = 8080
const server = app.listen(port, () => {
    //token cs_BC
    var token = "mj4l0futHoZa7bh0sEP39digpxb2sn4QCFZDvzFvuo2";
    //res notify to group line
    var eventNotify = {
        message: "[Test]💪API Server is Online",
        stickerPackageId: 1,
        stickerId: 103
    }
    lineNotify(token, eventNotify);
    logger.info(`API Server ready Endpoint : localhost:${port}`)
})


// seting process event

// SIGTERM จะมีการส่งออกมาเมื่อ Node.js ของเรานั้นตายหรือไม่สามารถทำงานได้
// SIGINT จะมีการส่งออกออกมาตอนที่เราหยุดการทำงานของ Server จาก terminal ด้วย CTRL+C

process.on('SIGINT', () => {
    server.close(() => {
        //token cs_BC
        var token = "mj4l0futHoZa7bh0sEP39digpxb2sn4QCFZDvzFvuo2";
        //res notify to group line
        var eventNotify = {
            message: "[Test]💥API Server is Shut Down!!! ",
            //pack sticker https://devdocs.line.me/files/sticker_list.pdf
            stickerPackageId: 1,
            stickerId: 1
        }
        lineNotify(token, eventNotify);
        logger.info('Process terminated')
    })
})

process.on('SIGTERM', () => {
    server.close(() => {
        //token cs_BC
        var token = "mj4l0futHoZa7bh0sEP39digpxb2sn4QCFZDvzFvuo2";
        //res notify to group line
        var eventNotify = {
            message: "[Test]💥API Server is Shut Down!!! ",
            //pack sticker https://devdocs.line.me/files/sticker_list.pdf
            stickerPackageId: 1,
            stickerId: 108
        }
        lineNotify(token, eventNotify);
        logger.info('Process terminated')
    })
})

//line notify event
function lineNotify(token, eventNotify) {
    //LINE@NOTIFY
    logger.debug('Line notify to Team develop');
    var request = require('request');

    //set http request to line@notify 
    //line@notify validate token add send event to group line
    request({
        method: 'POST',
        uri: 'https://notify-api.line.me/api/notify',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            // 'Authorization': 'Bearer RmgbwNGiNZ8nu8y2Y6dMPujBRdsrTQWIZkkQ1LIuRGh'
        },
        auth: {
            'bearer': token
        },
        form: eventNotify
    }, (err, httpResponse, body, res) => {     //send http request to line@notify 
        if (err) {
            logger.error(err);
        } else {
             // res.json({
             //     httpResponse: httpResponse,
             //     body: body
             // });
        }
    });
}

