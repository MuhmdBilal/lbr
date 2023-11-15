const express = require("express");
const app = express();
const { checkAminAuthMiddleware } = require("../../middlewares");
const User = require("../../models/users");
const moment = require("moment");
const { generateRandomTime } = require("../../helpers/index,js");

//get all Users list
app.get("/chatUsers", checkAminAuthMiddleware, async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).sort({ createdAt: -1 });

    const arrayOfData = users.map((element) => ({
      _id: element?._id,
      name: element?.name,
      time: generateRandomTime(),
      image:
        element?.image === ""
          ? "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
          : element?.image,
      lastMessage: element?.lastMessage ? element?.lastMessage : "Hello there!",
    }));

    res.status(200).json({
      data: arrayOfData,
      success: true,
      message: "success",
      code: "AllUsers_API",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = app;
