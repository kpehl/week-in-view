const router = require('express').Router();
// Sequelize connection to the database
const sequelize = require('../config/connection');
// User, Task, Event models
const { User, Task, Event} = require('../models');

// router.get('/', (req, res) => {
    
//   res.render('homepage', { 'TEST': "This is test" });
// });


router.get('/', (req, res) => {
    // Acess the User model and run the findOne() method to get a single user based on parameters
    User.findOne({
      // when the data is sent back, exclude the password property
      attributes: { exclude: ['password'] },
      where: {
        // use id as the parameter for the request
        // **CHANGE TO SESSION ID WHEN ESTABLISHED**
        id: 1
      },
      // include the tasks and events for the user
      include: [

          {
              model: Event,
              attributes: ['id','calendarId','title','start','end','goingDuration','comingDuration','color','isVisible','bgColor','dragBgColor','borderColor','category','dueDateClass','customStyle','isPending','isFocused','isReadOnly','isPrivate','location','attendees','recurrenceRule','state']
          },
          {
              model: Task,
              attributes: ['id', 'text', 'status']
          }
      ]
    })
      .then(dbUserData => {
        if (!dbUserData) {
          // if no user is found, return an error
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        // otherwise, return the data for the requested user and render the homepage template
        const userData = dbUserData.get({ plain: true });
        console.log(userData.events);
        res.render('homepage', { userData });
      })
      .catch(err => {
        // if there is a server error, return that error
        console.log(err);
        res.status(500).json(err);
      });
  });


module.exports = router;