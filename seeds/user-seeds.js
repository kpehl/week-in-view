const { User } = require('../models');
// const bcrypt = require('bcrypt');
const password = 'password';
// const hash = bcrypt.hashSync(password, 10);

const genPassword = require('../lib/passwordUtils').genPassword;
const saltHash = genPassword(password);  
const salt = saltHash.salt;
const hash = saltHash.hash;

const userData = [
    {
        username: 'test',
        id: 1,
        email:'test@gmail.com',
        hash: hash,
        salt: salt
    },
    {
        username: 'Dude',
        id: 2,
        email: 'dude@gmail.com',
        hash: hash,
        salt: salt
    },
    {
        username: 'Groovy',
        id: 3,
        email: 'groovy@gmail.com',
        hash: hash,
        salt: salt
    }
];

const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers;