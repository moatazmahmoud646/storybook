const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const Story = require('../models/Story')
const bodyParser = require('body-parser');

// @desc    Show add page
// @route   GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
  
    res.render('stories/add');
    //res.render('stories/add')
})

// @desc    Process add form
// @route   POST /stories
router.post('/', ensureAuth, async (req, res) => {
  try {
    const textareaValue = req.body.body;
    
  // Check if the textarea field is empty
  if (!textareaValue) {
    res.send('<script>alert("Story field is required"); window.history.back();</script>');
  
  
  }else{
    /*googleUser
    emailUser*/
      //req.body.user = req.user.id
      if (req.user.googleId) {
        req.body.googleUser = req.user._id;
      } else if (req.user.email) {
        req.body.emailUser = req.user._id;
      } else {
        throw new Error('Unknown user type');
      }
    
    
    
      await Story.create(req.body)
    
    res.redirect('/dashboard')
    
  }
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Show all stories
// @route   GET /stories

 
router.get('/', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: 'public' })
      .populate('googleUser')
      .populate('emailUser')
      .sort({ createdAt: 'desc' })
      .lean()
      

      if (stories.googleUser && stories.googleUser._id != req.user.id) {
        res.redirect('/stories');
      } else if (stories.emailUser&&stories.emailUser._id != req.user.id ) {
        
        res.redirect('/stories');
      }
        
        else {



    res.render('stories/index', {
      stories,

    })}
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Show single story
// @route   GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate('emailUser')
    .populate('googleUser').lean()

    if (!story) {
      return res.render('error/404')
    }

 
    
    else {
     // console.log("asdddddddddddd")
      res.render('stories/show', {
        story,
      })
    }
  } catch (err) {
    console.error(err)
    res.render('error/404')
  }
})

// @desc    Show edit page
// @route   GET /stories/edit/:id
/*router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
let story = await Story.findOne({_id: req.params.id}).populate('emailUser')
    .populate('googleUser').lean()
     if (!story) {
      console.log(story);
      return res.render('error/404')
      
    }

    else if (story.googleUser != req.user.googleId) {
      res.redirect('/stories')
    } 
   else if (story.emailUser != req.user.email) {
      res.redirect('/stories')
      console.log("ads")
    } 
    
    else {
      res.render('stories/edit', {
        story,
      })
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})
*/
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findOne({_id: req.params.id}).populate('emailUser')
      .populate('googleUser').lean();
      //console.log(story)
    if (!story) {
  
      return res.render('error/404');
    } else if (story.googleUser && story.googleUser._id != req.user.id) {
      res.redirect('/stories');
    } else if (story.emailUser&&story.emailUser._id != req.user.id) {
      
      res.redirect('/stories');
    } else {
     


      res.render('stories/edit', {
        
        story,
      });
    }
  } catch (err) {
    console.error(err);
    return res.render('error/500');
  }
});
// @desc    Update story
// @route   PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    const textareaValue = req.body.body;

  // Check if the textarea field is empty
  if (!textareaValue) {
    res.send('<script>alert("Story field is required"); window.history.back();</script>');
  
  
  }else{
    let story = await Story.findById(req.params.id).populate('emailUser')
    .populate('googleUser').lean()

    if (!story) {
      return res.render('error/404')
    }

    if (  story.googleUser &&story.googleUser._id!= req.user.id) {
      res.redirect('/stories')}
    else if ( story.emailUser &&story.emailUser._id != req.user.id)  {
      res.redirect('/stories')

    }

     else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      })

      res.redirect('/dashboard')
    }
  }} catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Delete story
// @route   DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate('emailUser')
    .populate('googleUser').lean()

    if (!story) {
      return res.render('error/404')
    }
    if (  story.googleUser &&story.googleUser._id!= req.user.id) {
      res.redirect('/stories')}
    else if (story.emailUser &&story.emailUser._id != req.user.id)  {
      res.redirect('/stories')

    } else {
      await Story.findByIdAndRemove({ _id: req.params.id })
      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    User stories
// @route   GET /stories/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: 'public',
    })
    .populate('emailUser')
    .populate('googleUser')
      .lean()

    res.render('stories/index', {
      stories,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

//@desc Search stories by title
//@route GET /stories/search/:query
router.get('/search/:query', ensureAuth, async (req, res) => {
  try{
      const stories = await Story.find({title: new RegExp(req.query.query,'i'), status: 'public'})
      .populate('emailUser')
    .populate('googleUser')
      .sort({ createdAt: 'desc'})
      .lean()
     res.render('stories/index', { stories })
  } catch(err){
      console.log(err)
      res.render('error/404')
  }
  /*const stories = await Story.find({
  category: req.params.category,
  status: 'public'
})
  .populate('emailUser')
    .populate('googleUser')
  .sort({ createdAt: 'desc' })
  .lean();*/
})


module.exports = router