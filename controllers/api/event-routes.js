// Dependencies
// Express.js connection
const router = require('express').Router();
// User model and Event model
const { User, Event } = require('../../models');
// Sequelize database connection
const sequelize = require('../../config/connection');
// the authorization middleware to redirect unauthenticated users to the login page
const withAuth = require('../../utils/auth');

// Routes

// GET api/events/  -- get all events
router.get('/', (req, res) => {
    Event.findAll({
        attributes: [
            'id',
            'user_id',
            'title',
            'text',
            'year',
            'month',
            'day',
            'hour',
            'minute',
            'duration',
            'created_at'
        ],
        include: [
            {
                model: User,
                'attributes': ['username']
            }
        ]
    })
    .then(dbEventData => res.json(dbEventData))
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

// Get //api/tasks/:id  -- get a single event
router.get('/:id', (req, res) => {
    Event.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'user_id',
            'title',
            'text',
            'year',
            'month',
            'day',
            'hour',
            'minute',
            'duration',
            'created_at'
        ],
        include: [
            {
                model: User,
                'attributes': ['username']
            }
        ]
    })
    .then(dbEventData => {
        if (!dbEventData) {
            res.status(404).json({ message: 'No event found with this id' });
            return;
        }
        res.json(dbEventData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    })
})

// Create a new event
router.post('/', (req, res) => {
    Event.create({
        user_id: req.body.user_id,
        title: req.body.title,
        text: req.body.text,
        year: req.body.year,
        month: req.body.month,
        day: req.body.day,
        hour: req.body.hour,
        minute: req.body.minute,
        duration: req.body.duration
    })
    .then(dbEventData => res.json(dbEventData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    })
})

// Update an event
router.put('/:id', (req, res) => {
    Event.update(req.body, 
        {
            where: {
                id: req.params.id
            }
        }
    )
    .then(dbEventData => {
        if (!dbEventData) {
            res.status(404).json({ message: 'No event found with this id' });
            return;
        }
        res.json(dbEventData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    })
})

// Delete an event
router.delete('/:id', (req, res) => {
    Event.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbEventData => {
        if (!dbEventData) {
            res.status(404).json({ message: 'No event found with this id' });
            return;
        }
        res.json(dbEventData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})


module.exports = router;