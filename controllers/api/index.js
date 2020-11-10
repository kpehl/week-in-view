// An index file to gather the API routes and export them for use

// Dependencies
// Server connection
const router = require('express').Router();
// User Routes
const userRoutes = require('./user-routes');
// Event Routes
const eventRoutes = require('./event-routes');
// Task Routes
const taskRoutes = require('./task-routes');

// Define route path for the API to use, e.g. api/users/
router.use('/users', userRoutes);
router.use('/events', eventRoutes);
router.use('/tasks', taskRoutes);

// Export the router
module.exports = router;