const express = require("express");
const app = express();
const { checkAminAuthMiddleware } = require("../../middlewares");
const multer = require("multer");
const path = require("path");
const ListOfPropertiesSchema = require("../../models/listofproperties");
const config = require("../../configs");

//post api upload image
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/images/");
//   },
//   filename: function (req, file, cb) {
//     const image =
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname);
//     cb(null, image);
//   },
// });
// const upload = multer({ storage: storage }).single("image");
app.post("/upload-image", checkAminAuthMiddleware, async (req, res) => {
  try{
    return res.status(200).json({success: true, data: {
      image: "https://www.worldatlas.com/r/w1200/upload/1e/65/5f/shutterstock-179315195.jpg"
    },
    code: "upload_image"
  })
  }catch (err) {
    res.status(500).json({ success: false, error: err });
  }
  // upload(req, res, function (err) {
  //   if (err instanceof multer.MulterError) {
  //     return res.status(500).json(err);
  //   } else if (err) {
  //     return res.status(500).json(err);
  //   }
  //   return res.status(200).json({ success: true, data: req.file?.filename });
  // });
});

//post api add properties
app.post("/add_property", checkAminAuthMiddleware, async (req, res) => {
  try {
    req.body?.propertyFields.forEach(async (element) => {
      let data = {
        // image: `${config.serverUrl}/public/images/${element?.property_image}`,
        image: element?.property_image,
        title: element?.property_title,
        price: element?.property_price,
        address: element?.property_location,
        destination: element?.address,
        link: element?.property_url,
        questionnaireId: req.body.questionnaire_id,
        userId: req.body.user_id,
      };
      await ListOfPropertiesSchema.create(data);
    });
    const successMessage =
      req.body?.propertyFields.length === 1
        ? "Property added successfully."
        : "List of Properties added successfully";
    res.status(200).json({
      success: true,
      message: successMessage,
      code: "Properties_API",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Internal Server Error " });
  }
});

module.exports = app;
