const mongoose = require('mongoose');
const Schema = mongoose.Schema

// Resume Model
const Applicant = mongoose.model('Applicant', new Schema({
  path: String,
  originalName: String, 
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  coverLetter: String
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
}));

module.exports = Applicant