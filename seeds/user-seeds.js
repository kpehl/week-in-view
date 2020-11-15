const { User } = require('../models');
const bcrypt = require('bcrypt');
const password = 'password';
const hash = bcrypt.hashSync(password, 10);

const userData = [
    {
        username: 'Michael',
        calendarId: 1,
        email:'michael@gmail.com',
        password: hash
    },
    {
        username: 'Dude',
        calendarId: 2,
        email: 'dude@gmail.com',
        password: hash
    },
    {
        username: 'Groovy',
        calendarId: 3,
        email: 'groovy@gmail.com',
        password: hash
    }
];

const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers;