const mongoose = require('mongoose');
const Schema = mongoose.Schema

const Message = mongoose.model('Message', new Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  message: String
}));

module.exports = Message