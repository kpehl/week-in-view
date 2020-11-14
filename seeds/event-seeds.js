const { Post } = require('../models');

const eventData = [{

    calendarId: '1',
    title: 'my schedule',
    category: 'time',
    dueDateClass: '',
    start: '2020-11-13T12:30:00+09:00',
    end: '2020-11-13T02:30:00+09:00'

    },
    {

        calendarId: '1',
        title: 'second schedule',
        category: 'time',
        dueDateClass: '',
        start: '2020-11-13T17:30:00+09:00',
        end: '2020-11-13T18:31:00+09:00',
        isReadOnly: true    // schedule is read-only
    },
    {
        calendarId: '1',
        title: 'THIRD schedule',
        category: 'time',
        dueDateClass: '',
        start: '2020-11-15T17:30:00+09:00',
        end: '2020-11-15T18:30:00+09:00'
    }
];

const seedEvents = () => Post.bulkCreate(eventData);

module.exports = seedEvents;