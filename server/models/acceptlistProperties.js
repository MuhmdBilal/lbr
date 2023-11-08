const mongoose = require("mongoose");

const acceptListSchema = new mongoose.Schema({
    porpertiesId: { type: String }
}, { _id: false }); 

const acceptListPropertiesSchema = new mongoose.Schema({
    acceptList: [{propertiesId: { type: String}}, { _id: false }], 
    questionnaireId: { type: String },
    userId: { type: String },
}, { timestamps: true });



const AcceptListOfPropertiesSchema = mongoose.model("acceptlistOfProperties", acceptListPropertiesSchema);
module.exports = AcceptListOfPropertiesSchema;