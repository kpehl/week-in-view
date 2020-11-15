const { Task } = require("../models");


const eventData = [
    {
      user_id: 1,
      text: "TEST TASK 1",
      status: true
    },
    {
        user_id: 1,
        text: "TEST TASK 2",
        status: true
    },
    {
        user_id: 1,
        text: "TEST TASK 3",
        status: true
    },
    {
        user_id: 1,
        text: "TEST TASK 4",
        status: true
    },
    {
        user_id: 1,
        text: "TEST TASK 5",
        status: false
    },
    {
        user_id: 1,
        text: "TEST TASK 6",
        status: false
    }
  ];

const seedTasks = () => Task.bulkCreate(eventData);

module.exports = seedTasks;
