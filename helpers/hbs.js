const moment = require('moment')
const Handlebars = require('handlebars');
const Story = require("../models/Story")
const User = require("../models/User")

module.exports = {
  formatDate: function (date, format) {
    return moment(date).utc().format(format)
  },
  truncate: function (str, len) {
    if (str.length > len && str.length > 0) {
      let new_str = str + '  '
      new_str = str.substr(0, len)
      new_str = str.substr(0, new_str.lastIndexOf(' '))
      new_str = new_str.length > 0 ? new_str : str.substr(0, len)
      return new_str + '...'
    }
    return str
  },
  stripTags: function (input) {
    return input.replace(/<(?:.|\n)*?>|&nbsp;/gm, '')
  },
  editIcon: function (storyUser, loggedUser, storyId, floating = true) {
  
    if (!storyUser || !loggedUser) {
      return '';
    }
    if (!loggedUser._id) {
      return '';
    }
    if (!loggedUser || !loggedUser._id) {
      return '';
    }
    if (User.googleId != loggedUser._id) {
       console.log("User.googleId:  " ,User.googleId)
      console.log("loggedUser111:  " ,loggedUser._id)
      return '';
    }
    /*if (Story.googleUser != loggedUser._id) {
      console.log("googleUser:  " ,Story.googleUser)
     console.log("storyUser:  " ,loggedUser._id)
     return '';
   }*/
  
     if (storyUser._id.toString() == loggedUser._id.toString()) {
      if (floating) {
        return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
      } else {
        return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`
      }
    } else {
     
      return ''
    }
  },
  select: function (selected, options) {
    return options
      .fn(this)
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$& selected="selected"'
      )
      .replace(
        new RegExp('>' + selected + '</option>'),
        ' selected="selected"$&'
      )
  },
  
}
Handlebars.registerHelper('concat', function() {
  let args = Array.prototype.slice.call(arguments, 0, -1);
  return args.join('');
})
