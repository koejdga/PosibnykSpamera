const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const letterTemplateSchema = new Schema({
  text: { type: String },
});

const LetterTemplate = model("LetterTemplate", letterTemplateSchema);
module.exports = LetterTemplate;
