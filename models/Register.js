const mongoose = require("mongoose");
const { Schema, model } = require('mongoose');
const { Date } = Schema.Types;
const bcrypt = require('bcryptjs');

const RegisterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  DateOfBirth: {
    type: Date,
    required: true
  },
})

const Register = mongoose.model('Register', RegisterSchema);

module.exports = Register;