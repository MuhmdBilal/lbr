const express = require("express");
const User = require("../models/users");
const ListOfPropertiesSchema = require("../models/listofproperties");
const Questionnaire = require("../models/questionnaire");
const {checkAminAuthMiddleware, checkAuthMiddleware} = require("../middlewares")
const app = express();

app.get("/users",checkAminAuthMiddleware, async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .sort({ createdAt: -1 })
      .select("_id name phone_no email confirmAdd");
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

app.put("/update-user/:userId",checkAminAuthMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    if (!user?.confirmAdd) {
      user.confirmAdd = true;
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "User verified successfully.",
      user: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update confirmAdd",
    });
  }
});

app.delete("/user-delete/:id",checkAminAuthMiddleware, async (req, res) => {
  try {
    const listOfQuestionnaire = await Questionnaire.find({
      userId: req.params.id,
    });
    if (listOfQuestionnaire.length > 0) {
      const arrayofId = listOfQuestionnaire.map((prop) => prop._id.toString());
      await ListOfPropertiesSchema.deleteMany({
        questionnaireId: { $in: arrayofId },
      });
    }

    await Questionnaire.deleteMany({ userId: req.params.id });
    await User.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "User Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.delete("/user-delete", checkAuthMiddleware, async (req, res) => {
  try {
    const userId = req?.userId;
    const listOfQuestionnaire = await Questionnaire.find({
      userId: userId,
    });
    if (listOfQuestionnaire.length > 0) {
      const arrayofId = listOfQuestionnaire.map((prop) => prop._id.toString());
      await ListOfPropertiesSchema.deleteMany({
        questionnaireId: { $in: arrayofId },
      });
    }

    await Questionnaire.deleteMany({ userId: userId });
    await User.findByIdAndDelete(userId);
    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
      code: "Delete_User_API",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = app;
