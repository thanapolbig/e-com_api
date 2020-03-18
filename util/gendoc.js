const logger = require('./logger.js');
const moment = require('moment');


var sql = require("mssql");
// config for your database
var config = {
  user: 'sa',
  password: 'P@d0rU123',
  server: '167.71.200.91',
  database: 'Padoru'
};
  async function gendoc(docType,bos) {
    // connect to your database
    var err =  await sql.connect(config)
    if (err) logger.error(err);
    var request = new sql.Request();
    if(docType=="PO"){
      var command = `SELECT SUBSTRING(doc_num,10,3) as count  FROM document_header WHERE  doc_num LIKE 'PO_%' AND buyer=${bos};`// sql command
    }else if(docType=="PR") {
      var command = `SELECT SUBSTRING(doc_num,10,3) as count  FROM document_header WHERE  doc_num LIKE 'PR_%' AND seller=${bos} ;`// sql command
    }else if(docType=="INV"){
      var command = `SELECT SUBSTRING(doc_num,11,3) as count  FROM document_header WHERE  doc_num LIKE 'INV_%' AND seller=${bos} ;`// sql command
    }
    var result =  request.query(command); //ยิง command เข้าไปใน DB
    var data = (await result).recordset
    var lastdocnum = 0
      if(data==null)
        {lastdoc=0}
      else{
        for(var i = 0;i<data.length;i++)
          {
            var num = parseInt(data[i].count)
            if(num>lastdocnum){
              lastdocnum = num
            }
          }
      }
      if(lastdocnum<9){
        var strlastdocnum = `00${lastdocnum+1}`
      }
        else if (lastdocnum <=9){
        var C = `0${lastdocnum+1}`

      } else if (lastdocnum>=99){
        var strlastdocnum = `${lastdocnum+1}`
      }



    logger.debug(strlastdocnum)
    var year = moment().format("YYYY");
    var month = moment().format("MM");
    if(docType=="PO"){
      var docnum =`PO_${year}${month}${strlastdocnum}`

    }else if(docType=="PR") {
      var docnum =`PR_${year}${month}${strlastdocnum}`

    }else if(docType=="INV"){
      var docnum =`INV_${year}${month}${strlastdocnum}`
    }
    logger.debug(docnum)
    return(docnum)
  }
module.exports = gendoc


