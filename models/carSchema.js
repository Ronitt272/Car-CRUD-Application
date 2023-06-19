let mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    carName: String, //here String,Number are mongodb data types
    Price: Number,
    Model: String
})

//module.exports exports what you want to expose from this file
//here, we are exporting the model

module.exports = new mongoose.model('Car',carSchema); //now, the model has been exported

//we will use this model in index.js