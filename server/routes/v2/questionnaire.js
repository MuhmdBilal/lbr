const express = require("express");
const app = express();
const {checkAminAuthMiddleware} = require("../../middlewares")
const Questionnaire = require("../../models/questionnaire");
const ListOfPropertiesSchema = require("../../models/listofproperties");

// get questionnaire by user Id  
app.get('/getQuestionnaireByUserId', checkAminAuthMiddleware, async (req, res) => {
  try {
      const userId = req.query.user_id;
      const questionnaires = await Questionnaire.find({ userId });
      if (!questionnaires || questionnaires.length === 0) {
          return res.status(404).json({ success: false, message: "Questionnaire records not found." });
      }
      let result = [];
      for (const questionnaire of questionnaires) {
          const properties = await ListOfPropertiesSchema.find({ questionnaireId: questionnaire._id.toString() }).select("_id title price address destination link image");
          const questionnaireData = {
            ...questionnaire.toObject(), 
            properties
        };
          result.push(questionnaireData);
      }
      res.status(200).json({
          success: true,
          data: result,
          message: 'Get All Questionnaires.',
          code: 'getAllQuestionnaire_API',
      });
  } catch (err) {
      res.status(500).json({ success: false, error: err });
  }
});

  module.exports = app;