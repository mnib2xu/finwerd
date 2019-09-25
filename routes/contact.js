var express = require('express');
var router = express.Router();
const multer = require('multer');
const Resume = require('../models/applicant')
const Message = require('../models/message')

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

router.post('/message', (req, res, next) => {
  const message = new Message({
      firstName: req.body.firstname,
      lastName: req.body.lastname,
      email: req.body.email,
      phone: req.body.phone,
      message: req.body.message
  });
  Message.create(message, (err) => {
      res.redirect('/thanks');
  });
});

module.exports = router;