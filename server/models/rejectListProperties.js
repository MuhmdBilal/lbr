const mongoose = require("mongoose");

const rejectListSchema = new mongoose.Schema({
    porpertiesId: { type: String }
}, { _id: false }); 

const rejectListPropertiesSchema = new mongoose.Schema({
    rejectList: [{propertiesId: { type: String}}, { _id: false }], 
    questionnaireId: { type: String },
    userId: { type: String },
}, { timestamps: true });



const RejectListOfPropertiesSchema = mongoose.model("RejectlistOfProperties", rejectListPropertiesSchema);
module.exports = RejectListOfPropertiesSchema;