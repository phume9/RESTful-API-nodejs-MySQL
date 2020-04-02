//Create a schema for product in order to save collection to Mongo
const mongoose = require('mongoose') //Need mongoose 
const Schema = mongoose.Schema //Declare schema 

//Schema is telling the type for example: String, Number or [String]
const productSchema = new Schema({
  product_name: String,
  product_number: Number,
  category: String,
  price: String, Number,
})

//After that create mongoose.model() to export to other file so that other file can
//import this model to use.
const ProductModel = mongoose.model('Product', productSchema)

module.exports = ProductModel //Exporting model 