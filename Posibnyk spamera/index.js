const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
fs = require("fs");

//#region Setup

let info = fs.readFileSync("config.json");
let obj = JSON.parse(info);
mongoose.connect(obj.dbUrl);
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.on("open", () => console.log("Connected to database"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  "/bootstrap",
  express.static(__dirname + "/node_modules/bootstrap/dist")
);
app.use("/jquery", express.static(__dirname + "/node_modules/jquery/dist/"));
app.use(express.static(__dirname));
app.use(express.json());

const Subscriber = require("./models/subscriber");

const LetterTemplate = require("./models/letterTemplate");

app.use(express.urlencoded({ extended: true }));

const sendLetter = require("./send_letter");

//#endregion

let subscribers = [];
message = null;
let currentTemplate = "";

app.get("/", async (req, res) => {
  try {
    subscribers = await Subscriber.find().sort({ email: 1 }).exec();
    const letterTemplates = await LetterTemplate.find().exec();

    res.render("main_page", {
      people: subscribers,
      templates: letterTemplates,
      currentTemplate: currentTemplate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/add", (req, res) => {
  res.render("add_email", { title: "Нова пошта" });
});

app.get("/edit/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let subscriber = await Subscriber.findById(id).exec();
    if (subscriber == null) {
      res.redirect("/");
    } else {
      res.render("edit_emails", { title: "Редагування", user: subscriber });
    }
  } catch (error) {
    message = null;
    res.redirect("/");
  }
});

app.post("/add", async (req, res) => {
  const subscriber = new Subscriber({
    name: req.body.name,
    surname: req.body.surname,
    patronymic: req.body.patronymic,
    email: req.body.email,
  });

  try {
    const alreadyExisting = await Subscriber.find({ email: subscriber.email });
    if (alreadyExisting.length > 0) {
      message = { message: "Ця пошта вже є в базі даних", type: "warning" };
    } else {
      await subscriber.save();
      message = { message: "Нову пошту додано", type: "success" };
      res.status(201).redirect("/");
    }
  } catch (error) {
    message = { message: error.message, type: "danger" };
  }
});

app.post("/update/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let s = {
      name: req.body.name,
      surname: req.body.surname,
      patronymic: req.body.patronymic,
      email: req.body.email,
    };
    await Subscriber.findByIdAndUpdate(id, s, { new: true });
    message = { message: "Пошту оновлено успішно", type: "success" };
    res.redirect("/");
  } catch (error) {
    message = { message: error.message, type: "danger" };
  }
});

app.get("/delete/:id", async (req, res) => {
  let id = req.params.id;
  try {
    await Subscriber.findByIdAndRemove(id);
    message = { message: "Пошту було видалено успішно", type: "info" };
    res.redirect("/");
  } catch (error) {
    message = { message: error.message, type: "danger" };
    res.redirect("/");
  }
});

app.get("/cancel", (req, res) => {
  message = null;
  res.redirect("/");
});

app.get("/send", (req, res) => {
  if (currentTemplate != "") {
    subscribers.forEach(async (subscriber) => {
      try {
        await sendLetter(
          subscriber.email,
          "Letter from spammer",
          currentTemplate
        );
        message = { message: "Листи відправлено", type: "success" };
      } catch (error) {
        message = { message: error.message, type: "danger" };
      }
    });
  } else {
    message = { message: "Виберіть шаблон", type: "danger" };
  }
  res.redirect("/");
});

app.get("/choose-template/:text", (req, res) => {
  message = null;
  currentTemplate = req.params.text;
  res.redirect("/");
});

app.get("/choose-template", (req, res) => {
  message = { message: "Ви нічого не написали", type: "warning" };
  res.redirect("/");
});

app.listen(3030, () => {
  console.log("listening on port 3030.. \nlocalhost:3030");
});
