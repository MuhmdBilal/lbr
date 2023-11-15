const express = require("express");
const app = express();
const { checkAminAuthMiddleware } = require("../../middlewares");
const User = require("../../models/users");
const moment = require("moment");
const { generateRandomTime } = require("../../helpers/index,js");
const { chatDetail } = require("../../constants");

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

//get single User chat
app.get("/chatDetail/:id", checkAminAuthMiddleware, async (req, res) => {
  try {
    const receiverId = req.params.id;
    const user = await User.findById(req?.userId);
    const receiverUser = await User.findById(receiverId);

    const arraOfData = chatDetail.map((element) => ({
      chatroom_id: 1,
      id: 138,
      sender_id: element?.sender_id == user?._id ? user?._id : receiverId,
      message: element?.message,
      created_at: element?.created_at,
      updated_at: element?.updated_at,
      receiver: {
        receiver_id: element?.sender_id == user?._id ? receiverId : user?._id,
        receiver_name:
          element?.sender_id == user?._id ? receiverUser?.name : user?.name,
        receiver_image_url:
          element?.sender_id == user?._id && receiverUser?.image != ""
            ? receiverUser?.image
            : element?.sender_id != user?._id && user?.image != ""
            ? user?.image
            : "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg",
        //     : user?.name,
        // // user?.image === ""
        // //   ? "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
        // //   : user?.image,
      },
    }));
    res.status(200).json({
      data: arraOfData,
      success: true,
      message: "success",
      code: "ChatDetail_API",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = app;
