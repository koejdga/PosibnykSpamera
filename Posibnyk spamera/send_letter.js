fs = require("fs");

let info = fs.readFileSync("config.json");
let obj = JSON.parse(info);

let nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: obj.user,
    pass: obj.pass,
  },
});

async function sendLetter(email, subject, text) {
  try {
    await transporter.sendMail({
      from: "avolidub@gmail.com",
      to: email,
      subject: subject,
      text: text,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = sendLetter;
