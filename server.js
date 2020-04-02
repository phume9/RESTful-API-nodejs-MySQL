const express = require('express');
const app = express(); //After install express framework 
const mongoose = require('mongoose'); //Installed npm mongoose for connecting to MongoDB 
const Product = require('./models/product') //Link to schema product file in models folder

//Telling mongoose to connect MongoDB in local machine(27017) DB name is node-api-101
mongoose.connect('mongodb://localhost:27017/node-api-101', { useNewUrlParser: true })

//Becaue Express can't really recieve request 
//body so the default will be undefined.
//In order to fix this, body-parser middleware will be used.
app.use(express.json());

// mock data
const products = [{}]

//HTTP request contains POST, GET, PUT and DELETE
app.post('/products', async (req, res) => { //To create new data in database
  const payload = req.body
  const product = new Product(payload)
  await product.save()
  res.status(201).end() // Respond back with http response status 201
});

app.get('/products', async (req, res) => { //To read and display (all) data in database
    const products = await Product.find({})
    res.json(products)
});

app.get('/products/:id', async (req, res) => { //To read and display (by id) data in database 
    const { id } = req.params
    const product = await Product.findById(id) //Use find by id to get specific id of products
    res.json(product) //Respond back the data
});

app.put('/products/:id', async (req, res) => { //To update product data (by id) in database
    const payload = req.body
    const { id } = req.params
  
    const product = await Product.findByIdAndUpdate(id, { $set: payload })
    res.json(product)
});

app.delete('/products/:id', async (req, res) => { //To delete data (by id) from database
    const { id } = req.params
  
    await Product.findByIdAndDelete(id)
    res.status(204).end() // Respond back with http respond status 204
});
  

app.listen(3000, () => {   //Declare port to 3000 so it will be localhost:3000
    console.log('Application is running on port 3000') //Display message when running in terminal
});

//HTTP response:

// 200 = ok, normal respond nothing gone error/wrong

// 201 = created, this is for return in case of create new data (Normally use for POST)

// 204 = no content, in case for DELETE (deleted) will send response empty back

// 400 = bad request, will use in case that the server recieved didn't match API Design
//       for instance: sent too many payload

// 401 = unauthorized, use for, when unknown/anonymous client request is who? can't confirmed
//       for exampke: No token or wrong token

// 403 = forbidden, passed the suthentication but didn't pass authorize 

// 404 = not found, there is no request url in system

// 500, 503 = this error will happen in server side for example: code crash 