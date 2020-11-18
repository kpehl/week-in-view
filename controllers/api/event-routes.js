// Dependencies
// Express.js connection
const router = require("express").Router();
// User model and Event model
const { User, Event } = require("../../models");

// Routes

// GET api/events/  -- get all events
router.get("/", (req, res) => {
  Event.findAll({
    attributes: ['id','calendarId','title','start','end','goingDuration','comingDuration','color','isVisible','bgColor','dragBgColor','borderColor','category','dueDateClass','customStyle','isPending','isFocused','isReadOnly','isPrivate','location','attendees','recurrenceRule','state'],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbEventData) => res.json(dbEventData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Get //api/events/:id  -- get a single event
router.get("/:id", (req, res) => {
  Event.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ['id','calendarId','title','start','end','goingDuration','comingDuration','color','isVisible','bgColor','dragBgColor','borderColor','category','dueDateClass','customStyle','isPending','isFocused','isReadOnly','isPrivate','location','attendees','recurrenceRule','state'],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbEventData) => {
      if (!dbEventData) {
        res.status(404).json({ message: "No event found with this id" });
        return;
      }
      res.json(dbEventData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Create a new event
router.post("/", (req, res) => {
  Event.create({
    calendarId: req.body.calendarId,
    title: req.body.title,
    body: req.body.body,
    category: req.body.category,
    dueDateClass: req.body.dueDateClass,
    start: req.body.start,
    end: req.body.end,
  })
    .then((dbEventData) => res.json(dbEventData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Update an event
router.put("/:id", (req, res) => {
  Event.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((dbEventData) => {
      if (!dbEventData) {
        res.status(404).json({ message: "No event found with this id" });
        return;
      }
      res.json(dbEventData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Delete an event
router.delete("/:id", (req, res) => {
  Event.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbEventData) => {
      if (!dbEventData) {
        res.status(404).json({ message: "No event found with this id" });
        return;
      }
      res.json(dbEventData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
