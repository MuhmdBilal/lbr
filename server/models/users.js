const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone_no: { type: Number, required: true },
    email: { type: String, required: true, unique: true},
    user_name: { type: String, unique: true},
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["admin", "user", "consultant"] },
    image: { type: String, default: ''},
    confirmAdd: { type: Boolean },
    assign_consultant_userName: { type: String }
  },
  { timestamps: true }
);
const Users = mongoose.model("User", userSchema, "users");
module.exports = Users;
