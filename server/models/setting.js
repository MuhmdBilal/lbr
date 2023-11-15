const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
    mobile_notification: {type: Boolean, default: true},
    email_notification: {type: Boolean, default: true},
    camera: {type: Boolean, default: true},
    gallary: {type: Boolean, default: true},
    location: {type: Boolean, default: true},
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
},
  { timestamps: true })

const Setting = mongoose.model("setting", settingSchema)
module.exports = Setting;
