const mongoose = require("mongoose");

const housingInformationObject = {
  is_exist: { type: Boolean, default: false },
  size: {
    min: { type: Number },
    max: { type: Number },
  },
  furnished: { type: Boolean },
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  workrooms: { type: Number },
  parking_slots: { type: Number },
};

const budgetInformationObject = {
  budget: { type: String },
  including_IPTU: { type: String },
  excluding_IPTU: { type: String },
};

const handleDatatypes = {
  is_true: { type: Boolean, required: true },
  additional_text: { type: String },
};
const questionnaireSchema = new mongoose.Schema(
  {
    look_and_see: {
      trip_date: { type: String, required: true },
      accompany: { type: String, required: true },
      accommodated: { type: String, required: true },
      address: { type: String, required: true }
    },
    expatriation: {
      exact_date: { type: String, required: true },
      moving_city: { type: String, required: true },
      area_house_hunting: { type: String, required: true },
      children: handleDatatypes,
      live_near: { type: String, required: true },
      max_commute_time: { type: String, required: true },
      pets: handleDatatypes,
    },
    budget_information: {
      furnished: budgetInformationObject,
      unfurnished: budgetInformationObject,
    },
    housing_information: {
      house: housingInformationObject,
      apartment: housingInformationObject,
    },
    facilities: {
      terrace_balcony: { type: String, required: true },
      gym: { type: String, required: true },
      tennis_court: { type: String, required: true },
      pool: { type: String, required: true },
      sauna: { type: String, required: true },
      children_playground: { type: String, required: true },
      distance_to_work: { type: String, required: true },
      distance_to_school_kindergarten: { type: String, required: true },
      distance_to_shopping_facilities: { type: String, required: true },
      distance_to_public_transport: { type: String, required: true },
      distance_to_restaurants_bars: { type: String, required: true },
    },
    additional_information: { type: String },
    userId: { type: String },
    userEmail: { type: String },
    pdf_URL: { type: String, default: '' },
  },
  { timestamps: true }
);
const Questionnaire = mongoose.model(
  "Questionnaire",
  questionnaireSchema,
  "questionnaire"
);
module.exports = Questionnaire;
