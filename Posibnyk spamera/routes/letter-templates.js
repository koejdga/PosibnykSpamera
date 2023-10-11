const express = require("express");
const router = express.Router();
const LetterTemplate = require("../models/letterTemplate");

router.get("/", async (req, res) => {
  try {
    const letterTemplates = await LetterTemplate.find();
    res.json(letterTemplates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
