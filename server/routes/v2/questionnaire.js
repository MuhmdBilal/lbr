const express = require("express");
const app = express();
const {checkAminAuthMiddleware} = require("../../middlewares")
const Questionnaire = require("../../models/questionnaire");

// get Api
// get questionnaire by user Id
app.get('/getQuestionnaireByUserId',checkAminAuthMiddleware, async (req, res) => {
    try {
        const User_id = req.query.user_id;
        const questionnaire = await Questionnaire.find({userId: User_id});
        if (!questionnaire) {
            return res
                .status(404)
                .json({ success: false, message: "Questionnaire record not found." });
        }
      res.status(200).json({
          success: true,
          data: questionnaire,
          message: 'Get All Questionnaires.',
          code: 'getAllQuestionnaire_API',
        });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });

  module.exports = app;