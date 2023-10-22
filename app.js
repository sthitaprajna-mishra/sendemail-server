const express = require("express");

const nodemailer = require("nodemailer");

const PORT = process.env.PORT || 3500;

const app = express();

const cors = require("cors");

const bodyParser = require("body-parser");

require("dotenv").config();

// Cross Origin Resource Sharing
// app.use(cors(corsOptions));
app.use(
  cors({
    origin: "*",
  })
);

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// built-in middlware for json
app.use(express.json());

// nodemailer
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

// testing success
transporter.verify((error, success) => {
  if (error) console.log(error);
  else {
    console.log(`Ready for messages\n${success}`);
  }
});

app.get("/test", () => {});

app.post("/sendemail", async (req, res) => {
  const { body, receiverEmail } = req?.body;
  if (
    !body ||
    !receiverEmail ||
    typeof body !== "string" ||
    typeof receiverEmail !== "string"
  ) {
    res.send("ImproperValues");
    return;
  }

  // mail options
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: receiverEmail,
    subject: "Verify Your Email",
    html: `${body}`,
  };

  transporter.sendMail(mailOptions);
  return res.send("email sent");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
