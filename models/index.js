// An index file to declare relationships between models and export them for use

// Dependencies
const Event = require('./Event');
const Task = require('./Task');
const User = require('./User');

// Associations
User.hasMany(Event, {
    foreignKey: 'user_id'
})

User.hasMany(Task, {
    foreignKey: 'user_id'
})

Event.belongsTo(User, {
    foreignKey: 'user_id'
})

Task.belongsTo(User, {
    foreignKey: 'user_id'
})

module.exports = { User, Event, Task };