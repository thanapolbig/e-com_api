const express = require('express')
const app = express()
const request = require('../controller/handle');
const logger = require('../util/logger.js')
var middleware = require('../middleware.js')
// test 
app.get('/ping', (req,res) => {
    res.send('pong')
})
//createpo

app.post(`/createpo` , middleware ,async (req , res , next)=>{
    try{
        var result = await new request().createPO(req.body)
        res.status(201)
        res.json(result)
        console.log(result)
    }catch (error) {
        let messageError = {
            statusCode: error.statusCode || 400,
            message: error.message || error
        }
        res.status(messageError.statusCode)
        res.json(messageError)
        logger.error(messageError.message)
    }

  // console.log(result)
});

//GET P0 buyer
app.post('/getBuyerPo', async (req, res) => {
    console.log(req.body)
    var data = await new request().getBuyerPO(req.body)
    console.log(data)
    res.status(200).json(data)
})

app.post('/getBuyerPR', async (req, res) => {
    console.log(req.body)
    var data = await new request().getBuyerPR(req.body)
    console.log(data)
    res.status(200).json(data)
})

// GET PO
app.post('/getPO', async (req,res) => {
    logger.info("function getPO Header")
    logger.debug(req.body)
    var id = req.body.id;
    var result = await new request().getPO(id);
    res.status(result[0]).json(result[1]);
})
//CREATE INV
app.post('/createINV', async (req, res) => {
    try {
        logger.debug(req.body)
        var result = await new request().createINV(req.body)
        res.status(201)
        res.json(result)
    } catch (error) {
        let messageError = {
            statusCode: error.statusCode ||  400,
            message: error.message || error
        }
        res.status(messageError.statusCode)
        res.json(messageError)
    }
})
// GET INV
app.post('/getInv', async (req, res) => {
    try {
        logger.debug(req.body)
        var result = await new request().getInv(req.body)
        res.status(200)
        res.json(result)
    } catch (error) {
      let messageError = {
        statusCode: error.statusCode ||  400,
        message: error.message || error
      }
      res.status(messageError.statusCode)
      res.json(messageError)
    }
  })
app.post('/getSellerViewInv', async (req, res) => {
    try {
        let token = 1001
        var result = await new request().getSellerViewInv(token)
        res.status(200)
        res.json(result)
    } catch (error) {
        let messageError = {
            statusCode: error.statusCode ||  400,
            message: error.message || error
        }
        res.status(messageError.statusCode)
        res.json(messageError)
    }
})
app.post('/getBuyerViewInv', async (req, res) => {
    try {
        var result = await new request().getBuyerViewInv(req)
        // console.log(req.body)
        // res.status(result.statusCode)
        res.json(result)
    } catch (error) {
        let messageError = {
            statusCode: error.statusCode ||  400,
            message: error.message || error
        }
        res.status(messageError.statusCode)
        res.json(messageError)
    }
})
//GET PR
app.post('/getPR', async (req, res) => {
    logger.debug(req.body)
    var data = await new request().getPR(req.body)
      res.status(data[0]).json(data[1]);
  })


 // 1.1 create PR
app.post("/createPR", async function (req, res){
    var create = await new request().createPR(req.body)
    logger.debug(create.message)
    res.status(create.status_code).send(create.message)
})

// 1.3 Get seller view PR list
app.get('/getPRSellerList', async function (req,res){
    var seller = 1009
    var data = await new request().getPrSellerList(seller)
    logger.debug(data.message)
    res.status(data.status_code).json(data.message)
})

// 2.2 Get Seller View Po list
app.get('/SellViewPO', async function(req, res){
  var token = 1001
  var data =await new request().getSellerViewPo(token)
  console.log(data.message)
  res.status(data.status).json(data.message)
})

module.exports = app