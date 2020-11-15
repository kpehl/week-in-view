const { Event } = require("../models");

const eventData = [
  {
    calendarId: 1,
    title: "my schedule",
    body: "BODY schedule 1",
    category: "time",
    dueDateClass: "",
    start: "2020-11-16T19:30:00+09:00",
    end: "2020-11-16T20:30:00+09:00"
  },
  {
    calendarId: 1,
    title: "second schedule - READ ONLY",
    body: "BODY schedule 2",
    category: "time",
    dueDateClass: "",
    start: "2020-11-17T17:30:00+09:00",
    end: "2020-11-17T18:31:00+09:00",
    isReadOnly: true, // schedule is read-only
  },  
  {
    calendarId: 1,
    title: "third schedule",
    body: "BODY schedule 3",
    category: "time",
    dueDateClass: "",
    start: "2020-11-18T07:30:00+09:00",
    end: "2020-11-18T08:31:00+09:00"
  },
  {
    calendarId: 1,
    title: "Fourth schedule",
    body: "BODY schedule 4",
    category: "time",
    dueDateClass: "",
    start: "2020-11-18T17:30:00+09:00",
    end: "2020-11-18T18:30:00+09:00"
  }
];

const seedEvents = () => Event.bulkCreate(eventData);

module.exports = seedEvents;
