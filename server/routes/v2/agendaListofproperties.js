const express = require("express");
const app = express();
const { checkAminAuthMiddleware } = require("../../middlewares");
const ListOfPropertiesSchema = require("../../models/listofproperties");

//get all list of approved property
app.get("/getAgendaList", checkAminAuthMiddleware, async (req, res) => {
  try {
    const data = await ListOfPropertiesSchema.find({
      status: "Accepted",
    }).sort({ createdAt: -1 });

    const arraOfData = data.map((element) => ({
      _id: element?._id,
      title: element?.title,
      address: element?.address,
      destination: element?.destination,
      link: element?.link,
      status: element?.status,
      time: element?.time,
      date: element?.date,
      pickuploaction: element?.pickuploaction,
      userEmail: element?.userEmail,
      image: element?.image,
      price: element?.price
    }));

    res.status(200).json({
      data: arraOfData,
      success: true,
      message: "success",
      code: "AgendaListOfProperties_API",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// update agenda Data
app.put("/agenda/:id", checkAminAuthMiddleware, async (req, res) => {
  try {
    await ListOfPropertiesSchema.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      message: "Agenda updated successfully.",
      code: "updateAgendaData_API",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Internal Server Error " });
  }
});

module.exports = app;
