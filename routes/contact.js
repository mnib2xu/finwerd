var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
const multer = require('multer');
const Resume = require('../models/applicant')
const Message = require('../models/message')

let transporter = nodemailer.createTransport({
  host: "smtp.strato.com",
  port: 465,
  secure: true,
  auth: {
      user: process.env.SEND_MAIL_ACCOUNT,
      pass: process.env.SEND_MAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Resume Upload POST
var upload = multer({
  dest: './public/uploads/'
});

router.post('/applicant', upload.single('cv'), (req, res, next) => {
  const cv = new Resume({
      path: `/uploads/${req.file.filename}`,
      originalName: req.file.originalname,
      firstName: req.body.firstname,
      lastName: req.body.lastname,
      email: req.body.email,
      phone: req.body.phone,
      coverLetter: req.body.coverletter
  });
  cv.save((err) => {
      res.redirect('/thanks');
  });
});

// Regular message
router.post('/message', (req, res, next) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.firstname}</li>
      <li>Company: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  let mailOptions = {
      from: 'berthold.jong@gmail.com', // sender address
      to: 'bas@leapsupreme.com', // list of receivers
      subject: 'Contact Request (Website)', // Subject line
      html: output // html body
  };


  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      res.redirect('/thanks');
      // When coming back from France: Google Search res.redirect to send ({emailSend: true}) to index.hbs so that the page changes after you've send the email.  
    })
})

module.exports = router;