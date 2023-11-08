const mongoose = require("mongoose");

const listOfPropertiesSchema = new mongoose.Schema({
   image: {type: String},
   title: {type: String},
   price: {type: Number},
   address: {type: String},
   destination: {type: String},
   link: {type: String},
   questionnaireId: {type: String},
   status: { type: String, default: "Pending" },
   time: {type: String},
   date: {type: String},
   pickuploaction: {type: String},
   userId: {type: String},
   userEmail: { type: String }
},
{ timestamps: true })

const ListOfPropertiesSchema = mongoose.model("listOfProperties", listOfPropertiesSchema);
module.exports = ListOfPropertiesSchema;