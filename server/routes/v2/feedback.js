const express = require("express");
const app = express();
const { checkAminAuthMiddleware } = require("../../middlewares");
const FeedbackList = require("../../constants");

//get all feedback list
app.get("/getFeedbackList", checkAminAuthMiddleware, async (req, res) => {
  try {
    const arraOfData = FeedbackList.map((element) => ({
      _id: element?._id,
      propertyLocation: element?.propertyLocation,
      time: element?.time,
      image: element?.image,
    }));

    res.status(200).json({
      data: arraOfData,
      success: true,
      message: "success",
      code: "FeedbackList_API",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

//get feedback detail by id
app.get("/feedbackDetailById", checkAminAuthMiddleware, async (req, res) => {
  try {
    const feedbackId = req.query.feedbackId;
    const filteredFeedback = FeedbackList.filter(
      (feedback) => feedback._id === feedbackId
    );

    const feedbackDetail = filteredFeedback.map((element) => ({
      propertyLocation: element?.propertyLocation,
      propertyCondition: element?.propertyCondition,
      tripDetail: element?.tripDetail,
      cityName: element?.cityName,
      overallNotes: element?.overallNotes,
    }));
    res.status(200).json({
      success: true,
      data: feedbackDetail,
      message: "success",
      code: "FeedbackDetail_API",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = app;
