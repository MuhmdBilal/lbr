const express = require("express");
const app = express();
const { checkAminAuthMiddleware } = require("../../middlewares");
const { FeedbackList } = require("../../constants");

//get all feedback list
app.get("/getFeedbackList", checkAminAuthMiddleware, async (req, res) => {
  try {
    const arraOfData = FeedbackList?.map((element) => ({
      _id: element?._id,
      detail: {
        propertyLocation: element?.propertyLocation,
        propertyCondition: element?.propertyCondition,
        tripDetail: element?.tripDetail,
        cityName: element?.cityName,
        overallNotes: element?.overallNotes,
      },
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

module.exports = app;
