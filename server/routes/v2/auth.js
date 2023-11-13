const express = require("express");
const User = require("../../models/users");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../../configs");
const {checkAminAuthMiddleware, checkAuthMiddleware} = require("../../middlewares")

app.post("/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res.status(400).json({
          success: false,
          message: "User not exist",
        });
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch)
        return res
          .status(400)
          .json({ success: false, message: "Invalid credentials" });
      const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
        expiresIn: config.expiresIn,
      });
      res.status(200).json({
        data: {
          userId: user?._id,
          name: user?.name,
          email: user?.email,
          phone_no: user?.phone_no,
          token,
          image: user?.image,
          role: user?.role
        },
        success: true,
        message: "Logged in successfully",
        code: "Login_API",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to login" });
    }
  });

//  get all user
app.get("/users", checkAminAuthMiddleware, async (req, res) => {
    try {
      const users = await User.find({ role: "user" })
      .sort({ createdAt: -1 })
      .select("_id name email createdAt image");
      res.status(200).json({
        data: users,
        success: true,
        message: "success",
        code: "AllUsers_API",
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  });
  module.exports = app;