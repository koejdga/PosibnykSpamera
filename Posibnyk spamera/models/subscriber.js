const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  patronymic: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Subscriber", subscriberSchema);
