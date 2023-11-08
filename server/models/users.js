const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone_no: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    image: { type: String, default: ''},
    confirmAdd: { type: Boolean },
  },
  { timestamps: true }
);
const Users = mongoose.model("User", userSchema, "users");
module.exports = Users;
