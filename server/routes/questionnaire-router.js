const express = require("express");
const app = express();
const { checkAuthMiddleware, checkAminAuthMiddleware } = require("../middlewares");
const Users = require("../models/users");
const Questionnaire = require("../models/questionnaire");
const path = require("path");
const generatePDF = require("./generatePDF");
const sendEmail = require("../nodemailer");
const filePath = path.join(__dirname, "../../public/KYC.pdf");
const mongoose = require('mongoose');
const multer = require("multer");
const fs = require('fs');
const config = require("../configs");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/questionnaire', checkAuthMiddleware, upload.single('file'), async (req, res) => {
  try {
    const userData = await Users.findById(req.userId);
    const userEmail = userData.email;
    const userName = userData.name;
    const fromMail = userData.email;
    const adminUsers = await Users.find({ role: 'admin' });
    const toMail = adminUsers.map(admin => admin.email);
    const filePath = await generatePDF(req.body);
    const fileName =`KYC_${Date.now()}.pdf`;
    const pdfFilePath = path.join("./public/pdf/", fileName);
   fs.copyFileSync(filePath, pdfFilePath);

    const questionnaireData = {
      ...req.body,
      userId: req.userId,
      userEmail: userEmail,
      pdf_URL: `${config.serverUrl}/public/pdf/${fileName}`
    };
    const mailOptions = {
      from: fromMail,
      to: [...toMail, 'lbr@yopmail.com', 'sean.carpenter@london-brazil.com', 'renato@london-brazil.com', "bilalsattar55544@gmail.com", "zeshanbutt9128@gmail.com"],
      subject: 'KYC Form',
      html: `
        <div>Hi Admin,</div>
        <div>You have received a KYC request from ${userName}. Please review the attached document or visit the admin panel for more details.</div>
      `,
      attachments: [{ filename: 'KYC.pdf', path: filePath }]
    };
    await sendEmail(mailOptions, function (error, info) {
      if (error) {
        console.log(error, 'error');
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    const newQuestionnaire = new Questionnaire(questionnaireData);
    await newQuestionnaire.save();

   return res.status(200).json({
      success: true,
      message: 'Questionnaire added successfully.',
      code: 'Questionnaire_API'
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = {};
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      return res.status(400).json({ success: false ,errors: validationErrors });
    }  else {
      console.error(error);
     return res.status(500).json({success: false , error: error.message });
    }
  }
});
 
// Get All Questionnaire by mobile side
app.get('/questionnaire', checkAuthMiddleware, async (req, res) => {
  try {
    const data = await Questionnaire.find({ userId: req.userId })
      .sort({ createdAt: -1 })

    const questionnaire = data.map(item => ({
      address: item?.look_and_see?.address,
      id: item._id,
      createDate: item.createdAt
    }));

    res.status(200).json({
      data: questionnaire,
      success: true,
      message: 'Success',
      code: 'QuestionnaireByUserId_API',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Get All Questionnaire by Admin Side
app.get('/getAllQuestionnaire', checkAminAuthMiddleware, async (req, res) => {
  try {
    const result = await Questionnaire.find().sort({ createdAt: -1 }).select('look_and_see.trip_date look_and_see.accommodated look_and_see.accompany look_and_see.address expatriation.moving_city _id userId userEmail');
    if (result.length > 0) {
      res.status(200).json({
        success: true,
        data: result,
        message: 'Get All Questionnaires.',
        code: 'getAllQuestionnaire_API',
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'No Questionnaires Found',
        code: 'getAllQuestionnaire_API',
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Get user and KYC Questionnaire length information by dashboard
 app.get("/dashboard-details", checkAminAuthMiddleware, async (req, res)=>{
  try{
    let totalNumberOfUser = await Users.countDocuments({ role: "user" })
    let totalNumberOfQuestionnaire = await Questionnaire.countDocuments()
    let dashboardDetails = {
      totalNumberOfUser: totalNumberOfUser,
      totalNumberOfQuestionnaire: totalNumberOfQuestionnaire
    }
   return res.status(200).json({ success: true, data: dashboardDetails, message: "Dashboard Details" });
  }catch (err){
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
  
   
 })
 
module.exports = app;
