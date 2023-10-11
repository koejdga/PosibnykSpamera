const express = require("express");
const router = express.Router();
const Subscriber = require("../models/subscriber");

router.get("/", async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const subscriber = new Subscriber({
    name: req.body.name,
    surname: req.body.surname,
    patronymic: req.body.patronymic,
    email: req.body.email,
  });

  try {
    const alreadyExisting = await Subscriber.find({ email: subscriber.email });
    if (alreadyExisting.length > 0) {
      res.status(400).json({ message: "This user is already signed in" });
    } else {
      const newSubscriber = await subscriber.save();
      res.status(201).json(newSubscriber);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const subscriberId = req.params.id;

  try {
    const updatedSubscriber = await Subscriber.findByIdAndUpdate(
      subscriberId,
      req.body,
      { new: true }
    );

    if (!updatedSubscriber) {
      return res.status(404).json({ message: "Subscriber not found" });
    }

    return res.json(updatedSubscriber);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Subscriber.deleteOne({ id: req.params.id });
    res.json({ message: "Deleted letter template" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
