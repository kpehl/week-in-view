// Dependencies
// Express.js connection
const router = require('express').Router();
// User model and Post model
const { User, Task } = require('../../models');
// Sequelize database connection
const sequelize = require('../../config/connection');
// the authorization middleware to redirect unauthenticated users to the login page
const withAuth = require('../../utils/auth');

// Routes

// GET api/tasks/  -- get all tasks
router.get('/', (req, res) => {
    Task.findAll({
        attributes: [
            'id',
            'user_id',
            'text',
            'status',
            'created_at'
        ],
        include: [
            {
                model: User,
                'attributes': ['username']
            }
        ]
    })
    .then(dbTaskData => res.json(dbTaskData))
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

// Get //api/tasks/:id  -- get a single task
router.get('/:id', (req, res) => {
    Task.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'user_id',
            'text',
            'status',
            'created_at'
        ],
        include: [
            {
                model: User,
                'attributes': ['username']
            }
        ]
    })
    .then(dbTaskData => {
        if (!dbTaskData) {
            res.status(404).json({ message: 'No task found with this id' });
            return;
        }
        res.json(dbTaskData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    })
})

// Create a new task
router.post('/', (req, res) => {
    Task.create({
        text: req.body.text,
        user_id: req.body.user_id
    })
    .then(dbTaskData => res.json(dbTaskData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    })
})

// Update a task
router.put('/:id', (req, res) => {
    Task.update(req.body, 
        {
            where: {
                id: req.params.id
            }
        }
    )
    .then(dbTaskData => {
        if (!dbTaskData) {
            res.status(404).json({ message: 'No task found with this id' });
            return;
        }
        res.json(dbTaskData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    })
})

// Delete a task
router.delete('/:id', (req, res) => {
    Task.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbTaskData => {
        if (!dbTaskData) {
            res.status(404).json({ message: 'No task found with this id' });
            return;
        }
        res.json(dbTaskData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})


module.exports = router;