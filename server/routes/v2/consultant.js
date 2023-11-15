const express = require("express");
const app = express();
const User = require("../../models/users");
const multer = require("multer");
const { checkAminAuthMiddleware } = require("../../middlewares");
const path = require("path");
const mongoose = require("mongoose");
const config = require("../../configs");
const Setting = require("../../models/setting");
// post APi Create Consultant
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "./public/images/");
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     },
// });

// const upload = multer({ storage: storage });
// upload.single('image')
app.post("/create-consultant", checkAminAuthMiddleware, async (req, res) => {
  try {
    const { username, email, password, phone_no, name } = req.body;

    let consultant_Data = {
      name: name,
      user_name: username,
      email: email,
      password: password,
      phone_no: phone_no,
      role: "consultant",
      image:
        "https://www.consultantsreview.com/newstransfer/upload/vn38rsz_business_consultant.jpg",
      // image: `${config.serverUrl}/public/images/${req.file?.filename}`,
    };
    let consultant = await User.create(consultant_Data);
    let UserIds = new Setting({ userId: consultant._id });
    await UserIds.save();
    res.status(200).json({
      success: true,
      message: "consultant added successfully.",
      code: "Consultant_API",
    });
  } catch (error) {
    if (error.code === 11000) {
      let errorMessage = "";
      if (error.keyPattern.email) {
        errorMessage = "Email is already taken.";
      } else if (error.keyPattern.username) {
        errorMessage = "Username is already taken.";
      }
      res.status(400).json({
        success: false,
        message: errorMessage,
        code: "Consultant_API",
      });
    } else {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        code: "Consultant_API",
      });
    }
  }
});

// get Consultant
app.get("/get_consultant", checkAminAuthMiddleware, async (req, res) => {
  try {
    let result = await User.find({ role: "consultant" })
      .sort({ createdAt: -1 })
      .select("_id name phone_no email user_name ");
    res.status(200).json({
      data: result,
      success: true,
      message: "success",
      code: "AllUsers_API",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});
module.exports = app;
