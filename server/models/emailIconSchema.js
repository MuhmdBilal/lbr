const mongoose  = require('mongoose')

const emailIconSchema = new mongoose.Schema({
    locationIcon: {type: String},
    webIcon : {type: String},
    tick: {type: String}
})

const EmailIconSchema = mongoose.model("emailIconSchema", emailIconSchema);
module.exports = EmailIconSchema;