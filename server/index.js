process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'
const path = require('path');
const express = require('express');
const transporter = require('./config');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

const buildPath = path.join(__dirname, '..', 'build');
app.use(express.json());
app.use(express.static(buildPath));

app.post('/send', (req, res) => {
  try {
    const mailOptions = {
      from: process.env.email, // sender address
      to: req.body.email, // list of receivers
      subject: req.body.subject, // Subject line
      html: req.body.message // plain text body
    };

    transporter.sendMail(mailOptions, function(err, info) {
      if (err) {
        console.log("error:",err)
        res.status(500).send({
          success: false,
          message: 'Something went wrong. Try again later'
        });
      } else {
        res.send({
          success: true,
          message: 'Thanks for contacting us. We will get back to you shortly'
        });
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Something went wrong. Try again later'
    });
  }
});

app.listen(3030, () => {
  console.log('server start on port 3030');
});
