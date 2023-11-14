const express = require("express");
const User = require("../models/users");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { isEmailValid } = require("../helpers/index,js");
const config = require("../configs");
const { checkAuthMiddleware, checkAminAuthMiddleware } = require("../middlewares");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const Setting = require("../models/setting")
app.post("/auth/register", async (req, res) => {
  try {
    const { name, phone_no, email, password } = req.body;
    if (!(name && phone_no && email && password)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payload" });
    }
    if (!isEmailValid(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }
    const prevRes = await User.findOne({ email });
    if (prevRes) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      phone_no,
      role: "user",
      confirmAdd: false,
    });

    const user = await newUser.save();
    let UserIds = new Setting({userId: user._id})
    await UserIds.save()
    const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
      expiresIn: config.expiresIn,
    });
    res.status(200).json({
      data: { name, email, phone_no, token },
      success: true,
      message: "Your account has not been verified by the admin yet. Please wait for a short period or contact the admin for assistance.",
      code: "Register_API",
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = {};
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      return res.status(400).json({ success: false, errors: validationErrors });
    } else {
      console.error(error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({
        success: false,
        message: "User not exist",
      });
        if (user?.role == "user" && !user?.confirmAdd)
        return res.status(400).json({
          success: false,
          message: "Your account has not been verified by the admin yet. Please wait for a short period or contact the admin for assistance.",
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

app.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminUser = await User.findOne({ email, role: "admin" });

    if (!adminUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, adminUser.password);
    if (!passwordMatch) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid password" });
    }
    const token = jwt.sign({ userId: adminUser._id }, config.jwtSecret, {
      expiresIn: config.expiresIn,
    });
    res.status(200).json({ success: true, message: "Login successful", token:token });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Update Api Change password user side
app.put("/change-password", checkAuthMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req?.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found." });
    }
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid old password" });
    }
    const newPasswordCreate = await bcrypt.hash(newPassword, 10);
    user.password = newPasswordCreate;
    await user.save();
    return res.json({
      success: true,
      message: "Password updated successfully",
      code: "passwordUpdate_API",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

//Get API user get by Id admin side
app.get("/user/:id", checkAminAuthMiddleware, async (req, res) => {
  try {
    let user = await User.findOne({ _id: req?.params?.id }).select("_id name");
    res
      .status(200)
      .json({ success: true, data: user, message: "User get successfully." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update Profile by user side
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/");
  },
  filename: function (req, file, cb) {
    const image =
      file.fieldname + "-" + Date.now() + path.extname(file.originalname);
    cb(null, image);
  },
});
const upload = multer({ storage: storage }).single("image");
app.put("/profile-Update", checkAuthMiddleware, upload, async (req, res) => {
  try {
    const { userId, file } = req;

    const user = await User.findById(userId).select(
      "_id name phone_no email image"
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found." });
    }
    user.image = `${config.serverUrl}/public/images/${file?.filename}`;
    await user.save();
    return res.json({
      success: true,
      message: "Profile updated successfully",
      code: "profileUpdate_API",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = app;
