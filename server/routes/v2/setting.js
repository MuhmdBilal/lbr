const express = require("express");
const app = express();
const Setting = require("../../models/setting");
const { checkAuthMiddleware } = require("../../middlewares");

//  get api settings
app.get("/settings", checkAuthMiddleware, async (req, res) => {
  try {
    let result = await Setting.findOne({ userId: req?.userId });
    if (!result) {
      result = new Setting({ userId: req?.userId });
      await result.save();
    }
    res.status(200).json({
      success: true,
      data: result,
      message: "Setting get successfully.",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

// Update Setting Api
app.put("/upadte-setting", checkAuthMiddleware, async (req, res) => {
  try {
    await Setting.findOneAndUpdate({ userId: req?.userId }, req.body, {
      new: true,
    });
    return res.status(200).json({
      success: true,
      message: "Setting updated successfully.",
      code: "Upadte_setting",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
});
module.exports = app;
