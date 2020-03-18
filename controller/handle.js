const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Kdai:blockchainkmitl@cluster0-9oqtf.mongodb.net/KDAI?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
const moment = require('moment');
const logger = require('../util/logger.js');
const gendoc = require('../util/gendoc.js');


var sql = require("mssql");
// config for your database
var config = {
    user: 'sa',
    password: 'P@d0rU123',
    server: '167.71.200.91',
    database: 'Padoru'
};

// connect to your database
var err = sql.connect(config)
if (err) console.log(err);

class request {
    async createINV(req) {
        let functionName = '[createInv]' //ชื่อ function
        return new Promise(async function (resolve, reject) {
            try {
                var request = new sql.Request();
                var seller = 1002
                var buyer = req.buyer || reject`${functionName} buyer is required`
                var doc_num = await gendoc("INV",seller);
                var type = 1005
                var status = 1
                var currentDate = moment().format('YYYY-MM-DD')  //ค่า วันเดือนปี ปัจจุบัน
                logger.debug(currentDate)
                var doc_ref = req.doc_ref
                var commandCreate = `INSERT INTO document_header
(doc_num, doc_ref, buyer, seller, doc_date, [type], status, create_comp, target_comp, create_date, update_date)
VALUES('${doc_num}', '${doc_ref}', ${buyer}, ${seller}, ${currentDate},${type}, ${status}, ${seller}, ${buyer}, ${currentDate}, ${currentDate});`// sql command
                var resultCreate = await request.query(commandCreate); //ยิง command เข้าไปใน DB
                var commandQueryInv = `SELECT id, doc_num FROM document_header WHERE doc_num = '${doc_num}' AND [type] = 1005;`// sql command
                var resultQueryInv = await request.query(commandQueryInv); //ยิง command เข้าไปใน DB
                let massage = {
                    statusCode: 201,
                    status: `create success`,
                    massage: {
                        doc_id: resultQueryInv.recordset[0].id,
                        doc_num: resultQueryInv.recordset[0].doc_num
                    }
                }
                logger.info(massage.status)
                resolve(massage)
            } catch (error) { //ดัก error
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName} CREATE failed [Error] ${error}`
                }
                logger.error(messageError.message)
                reject(messageError)
            }
        })
    }
    async getInv(req) {
        let functionName = '[getInv]' //ชื่อ function
        return new Promise(async function (resolve, reject) {
            try {
                var request = new sql.Request();
                var id = req.id || reject`${functionName} id is required`
                var seller = 1001
                var buyer = 1000
                var checkId = await isNaN(id) //เช็ค type id ว่าส่งมาเป็น int ไหม
                if (checkId == true) {
                    logger.error(`${functionName} Please use Integer(Type of Number)`)
                    resolve`${functionName} Please use Integer(Type of Number)`
                } else {
                    var command = `SELECT doc_num, doc_ref, buyer, seller, doc_date, type, status  FROM document_header WHERE id = ${id} AND [type] = 1005 AND (seller = ${seller} OR buyer = ${buyer}) ;`// sql command
                    var result = await request.query(command); //ยิง command เข้าไปใน DB
                    let message = {
                        statusCode: 200,
                        message: result.recordset
                    }
                    if (result.recordset.length != 0) resolve(message)//เช็คหา id
                    else {
                        let messageError1 = {
                            statusCode: 400,
                            message: `${functionName} id not found`
                        }
                        logger.error(messageError1.message)
                        reject(messageError1)
                    }
                }
            } catch (error) { //ดัก error
                let messageError2 = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName} query failed [Error] ${error}`
                }
                logger.error(messageError2.message)
                reject(messageError2)
            }
        })
    }
    async createPO(req) {
        let FunctionName = '[createpo]'
        logger.info(FunctionName)
        return new Promise(async function (resolve, reject) {
            try{
                var Buyer = req.buyer || reject(`createpo.buyer is required`)
                var Seller = req.seller || reject(`createpo.seller is required`)
                var doc_ref = req.doc_ref || reject(`createpo.doc_ref is required`)
                var doc_num = await gendoc("PO",Buyer);

                var Checkbuyer = isNaN(Buyer)
                var Checkseller = isNaN(Seller)
                if(Checkbuyer || Checkseller == true){
                    console.log(`${FunctionName} Please use Integer(Type of Number)`)
                    return `${FunctionName} Please use Integer(Type of Number)`
                }
                var cerrent = moment().format("YYYY-MM-DD");
                var request = new sql.Request();
                var cerrent = moment().format("YYYY-MM-DD");
                var commandpo = `INSERT INTO Padoru.dbo.document_header
            (doc_num, doc_ref, buyer, seller, doc_date, [type], status, create_comp, target_comp, create_date, update_date)
            VALUES('${doc_num}', '${doc_ref}', ${Buyer}, ${Seller}, ${cerrent},1003, 1, ${Buyer}, ${Seller}, ${cerrent}, ${cerrent});`
                var result = await request.query(commandpo); //นำเข้าข้อมูลใส่ db
                var commandquery = `SELECT id, doc_num FROM document_header WHERE doc_num = '${doc_num}' AND [type] = 1003;`
                var data = await request.query(commandquery);
                let message = {
                    statusCode: 201,
                    status: `${FunctionName} success`,
                    message: {
                        doc_id : data.recordset[0].id,
                        doc_num : data.recordset[0].doc_num
                    }
                }
                resolve(message)

            }catch (error) {
                let messageError = {
                    statusCode: error.statusCode || 400,
                    status: `not success`,
                    message: error.message || `${FunctionName} `
                }
                reject(messageError)
                logger.error(messageError.message)
            }
        })

    }



    async getPO(id) {
        // --- Mongo DB ---
        // await client.connect();
        // const collection = await client.db("KDAI").collection("Document");
        // var data = await collection.findOne({ _id: id });
        // await client.close();
        // return data;

        var error;
        if (isNaN(id)) { // id is not a number
            logger.error("getPO Header : id is not a number")
            error = {
                status_code: "400",
                status: "Bad Request",
                message: "id ไม่ใช่ตัวเลข โปรดใส่ค่าที่เป็นตัวเลข"
            }
            return [400, error]; //400
        }
        //--- MSSQL ---
        //hardcode
        var buyer = 1233;
        var seller = 1000;
        var request = new sql.Request();
        var data = await request.query(`SELECT id, doc_num, doc_ref, buyer, seller, doc_date, [type], status
                                        FROM Padoru.dbo.document_header
                                        WHERE id = ${id} AND type = 1003 AND (buyer = ${buyer} OR seller = ${seller})`);
        // ถ้าไม่มี document record.length == 0
        if (data.recordset.length == 0) {
            logger.error("getPO Header : cannot find document");
            error = {
                status_code: "404",
                status: "Not Found",
                message: "ไม่พบเอกสารนี้" //404
            }
            return [404, error];
        } else { // return document ที่ query มา
            logger.info("getPO Header : query document success")
            return [200, data.recordset]; //200
        }
    }
    async createPR(req) {

        // client.connect(err => {
        //               const collection = client.db("KDAI").collection("testcreatecoll");
        //
        // var DocNum = body.body._id
        // var DocRef = body.body.DocRef
        // var Owner = body.body.Owner
        // var Dealer = body.body.Dealer
        // var DocDate = body.body.DocDate
        //
        //
        // collection.insertOne ({_id: DocNum , DocRef: DocRef ,Owner:Owner , Dealer:Dealer , DocDate:DocDate , Type:"PR" })
        // client.close();
        // });
        // var request = new sql.Request();
        // request.query(`INSERT INTO Padoru.dbo.document_header
        // (id, doc_ref, seller, buyer, doc_date, [type])
        // VALUES(${req.id}, '${req.doc_ref}', '${req.seller}', '${req.buyer}', '${req.doc_date}', '${req.type}')`);

        // ----------datetime----------
        var moment = require('moment')
        var date = new moment().format('YYYY-MM-DD');
        // var date = new Date()
        // var date = now.getDate()
        // var time = now.getHours()
        // var mon = now.getMonth()
        // var year = now.getFullYear()
        //var datenow = new Date(year,mon,date,time)

        //---------insert data---------
        // ไม่ใส่ค่ามา
        if (req.buyer == null) {
            var message = {
                "status_code": 400,
                "status": "Bad request",
                "message": "โปรดใส่ข้อมูลให้ครบ",
            }
            logger.error(message.status)
            return message
        }// ใส่ตัวเลขมา
        else if (isNaN(req.buyer)) {
            var message = {
                "status_code": 400,
                "status": "Bad request",
                "message": "โปรดใส่ข้อมูลของ buyer เป็นตัวเลข"
            }
            logger.error(message.status)
            return message
        } else {
            var request = new sql.Request();
            var seller = 1009
            var doc_num = await gendoc("PR",seller);
            await request.query(`INSERT INTO Padoru.dbo.document_header (doc_num, doc_ref, buyer, seller, doc_date, [type], status, create_comp, target_comp, create_date, update_date)
        VALUES('${doc_num}', null , ${req.buyer}, ${seller}, ${date}, 1001, 1, '${seller}', '${req.buyer}', ${date}, ${date});`);

            var id = await request.query(`
          SELECT id,doc_num
          FROM document_header dh
          WHERE dh.doc_num = '${doc_num}' AND dh.buyer = '${req.buyer}'
          `);

            var message = {
                "status_code": 201,
                "status": "success",
                "message": {
                    "id": id.recordset[0].id,
                    "doc_num": id.recordset[0].doc_num
                }
            }
            logger.info(message.status)

            return message;
        }
    }
    async getPR(req) {
        // await client.connect();
        // const collection = await client.db("KDAI").collection("Document");
        // var data = await  collection.findOne({_id: id });
        // await client.close();
        // return data ;
        var error;
        var space = req.id;
        //เช็คช่องว่าง
        if (space == "") {
            logger.error("Please Enter ID");
            error = {
                status_code: "400",
                status: "bad request",
                error: "Please Enter ID"
            }
            return [404, error]
        }

        var numBer = isNaN(req.id)
        //เข็คว่าเป็นnumberหรือไม่
        if (numBer == true) {
            logger.error("id not number");
            error = {
                status_code: "400",
                status: "bad request",
                error: "id not number"
            }
            return [404, error]
        }
        var buyer = 1088;
        var seller = 1009;
        var request = new sql.Request();
        var data = await request.query(`SELECT id, doc_num, doc_ref, buyer, seller, doc_date, [type], status
        FROM Padoru.dbo.document_header
        WHERE id = ${req.id} AND [type] = 1001 AND (buyer = ${buyer} OR seller = ${seller}) `);
        //เช็คว่ามีdocumentหรือไม่
        if (data.recordset.length == 0) {
            logger.error("no document PR");
            error = {
                status_code: "404",
                status: "not found",
                message: "no document PR"
            }
            return [404, error];
        }
        //ถ้าตรงเงื่อนไขส่งอันนี้
        else {
            logger.info("Query success")
            logger.debug(data.recordset);
            error = {
                status_code: 200,
                status: "success",
                message: data.recordset[0]

            }

            return [200, error];
        }

    }


    async getSellerViewInv(token) {
        let functionName = '[getSellerViewInv]' //ชื่อ function
        return new Promise(async function (resolve, reject) {
            try {
                var request = new sql.Request();
                var command = `SELECT doc_num, doc_ref, buyer, seller, doc_date, type, status  FROM document_header WHERE type = 1005 AND create_comp = ${token};`// sql command
                var result = await request.query(command); //ยิง command เข้าไปใน DB
                let message = {
                    statusCode: 200,
                    message: result.recordset
                }
                resolve(message)
            } catch (error) {
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName} query failed [Error] ${error}`
                }
                logger.error(messageError.message)
                reject(messageError)
            }
        })
    }

    async getBuyerPO(req) {
        let FunctionName = '[getBuyerPO]'
        logger.info(FunctionName)
        try {
            var request = new sql.Request();
            var data = await request.query(`SELECT id, doc_num, doc_ref, buyer, seller, doc_date, [type], status, create_comp, target_comp, create_date, update_date
        FROM Padoru.dbo.document_header
        WHERE buyer = ${req.buyer} AND type = '1003'`);
            let message = {
                statusCode: 200,
                message: data.recordset
            }
            resolve(message)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || `${functionName} query failed [Error] ${error}`
            }
            logger.error(messageError.message)
            reject(messageError)

        }

    }

    async getBuyerPR(req) {
        let FunctionName = '[getBuyerPR]'
        logger.info(FunctionName)
        try {
            var request = new sql.Request();
            var data = await request.query(`SELECT id, doc_num, doc_ref, buyer, seller, doc_date, [type], status, create_comp, target_comp, create_date, update_date
        FROM Padoru.dbo.document_header
        WHERE buyer = ${req.buyer} AND type = '1001'`);
            let message = {
                statusCode: 200,
                message: data.recordset
            }
            resolve(message)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || `${functionName} query failed [Error] ${error}`
            }
            logger.error(messageError.message)
            reject(messageError)

        }

    }



    async getPrSellerList(req) {
        var request = await new sql.Request();
        //------------get data-------------
        var data = await request.query(`
    SELECT id, doc_num, doc_ref, buyer, seller, doc_date, [type], status
    FROM document_header dh
    WHERE dh.create_comp = '${req}' AND type LIKE '1001'
    `);
        if (data.recordset.length == 0) { //กรณีไม่มีข้อมูลใน list เลย
            var message = {
                "status_code": 404,
                "status": "Not found",
                "message": "ไม่มีข้อมูลของ PR"
            }
            logger.error(message.status)
            return message
        } else { //มีข้อมูล
            var message = {
                "status_code": 200,
                "status": "success",
                "message": data.recordset
            }
            logger.info(message.status)
            return message
        }
    }

    async getBuyerViewInv(req) {
        let functionName = '[getBuyerViewInv]' //ชื่อ function
        return new Promise(async function (resolve, reject) {
            try {
                var request = new sql.Request();
                var buyer_id = req.body.buyer;   //hardcode ของจริงแกะจาก token
                var command = `SELECT id,doc_num, doc_ref, buyer, seller, doc_date, type, status  FROM document_header WHERE buyer = ${buyer_id} AND type = 1005;`
                var result = await request.query(command);
                console.log(result.recordset)
                let message = {
                    status_code: 200,
                    status: functionName + " Query success",
                    massage: result.recordset
                }
                resolve(message)
            } catch (error) {
                let messageError = {
                    status_code: error.statusCode || 400,
                    status: functionName + " Query fail",
                    massage: error.message || `${functionName} query failed [Error] ${error}`
                }
                logger.error(messageError.message)
                reject(messageError)
            }
        })
    }

    async getSellerViewPo(req) {
        var request = new sql.Request();
        var data = await request.query(`SELECT id,doc_num,doc_ref,buyer,seller,doc_date,type,status FROM document_header WHERE seller = ${req}`);

        if (data.recordset.length != 0) { //ถ้าใช้ recordset.length มันจะมีข้อมูลอยู่ตลอด จึงต้องใช้ data แทน
            var message = {
                "message": data.recordset,
                "status": 200
            }
            logger.info(message.status)
            return message; //ถ้ามีข้อมูลใน ms sql จะดึงข้อมูล PO มาแสดง
        } else {
            var message = {
                "message": "Not Found.",
                "status": 404
            }
            logger.error(message.status)
            return message; // ถ้าไม่มีข้อมูลจะแจ้งว่าไม่พบ
        }
    }
}

module.exports = request


