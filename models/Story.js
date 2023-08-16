const mongoose = require('mongoose')

const StorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'public',
    enum: ['public', 'private'],
  },
 /* user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
    
  },*/
  googleUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  emailUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Register',
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    required: true,
    enum: ['fiction', 'Non-fiction', 'Poetry', 'Drama','Others']
  },

})


module.exports = mongoose.model('Story', StorySchema)