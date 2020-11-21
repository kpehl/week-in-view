////  Modified from https://codepen.io/AnzilkhaN/pen/GRJqPVK

"use strict";

var CalendarList = [];

function CalendarInfo() {
  this.id = null;
  this.name = null;
  this.checked = true;
  this.color = null;
  this.bgColor = null;
  this.borderColor = null;
  this.dragBgColor = null;
}

function addCalendar(calendar) {
  CalendarList.push(calendar);
}

function findCalendar(id) {
  var found;

  CalendarList.forEach(function (calendar) {
    if (calendar.id === id) {
      found = calendar;
    }
  });

  return found || CalendarList[0];
}

async function GetUser() {
  const user_id = document.querySelector('#user-id').textContent;
  const response = await fetch(`/api/users/${user_id}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      return json.id;
    });
    return response;
}

async function GetMyEvents(){
    const user_id = document.querySelector('#user-id').textContent;
    const response = await fetch(`/api/users/${user_id}`)
        .then( response => {
            return response.json();
        })
        .then( function (json) {
          const events = json.events;
          return events;
        })
        return response;
}

(function () {
  var calendar;

  // Create calendar for User from Database
  calendar = new CalendarInfo();
  calendar.id = GetUser();
  calendar.name = "Events";
  calendar.color = "#FF8C1A";
  calendar.bgColor = "#FDF8F3";
  calendar.dragBgColor = "#FDF8F3";
  calendar.borderColor = "#FDF8F3";
  addCalendar(calendar);
})();

(function (window, Calendar) {
  var cal, resizeThrottled;
  var datePicker, selectedCalendar;

  cal = new Calendar("#calendar", {
    defaultView: "week",
    taskView: false,
    useCreationPopup: true,
    useDetailPopup: true,
    calendars: CalendarList,
    template: {
      allday: function(schedule) {
          return getTimeTemplate(schedule, true);
      },
      time: function(schedule) {
          return getTimeTemplate(schedule, false);
      },
      locationPlaceholder: function() {
        return 'Location';
      },
      popupDetailLocation: function(schedule) {
        return 'Location : ' + schedule.location;
      },
  }
  });

  // event handlers
  cal.on({
    clickMore: function (e) {
      // console.log("clickMore", e);
    },
    clickSchedule: function (e) {
      // console.log("clickSchedule", e);
    },
    clickDayname: function (date) {
      // console.log("clickDayname", date);
    },
    beforeCreateSchedule: function(e) {
        // console.log('beforeCreateSchedule', e)
        dbSaveNewSchedule(e)
    },
    beforeUpdateSchedule: function (e) {
      var schedule = e.schedule;
      var changes = e.changes;

      // console.log("beforeUpdateSchedule", e);
      
      if (!changes.category) {
        changes.category = schedule.category;
      }

      if (changes && !changes.isAllDay && schedule.category === 'allday') {
        changes.category = 'time';
      }

      dbUpdateSchedule(schedule.id, changes);
    },
    beforeDeleteSchedule: function (e) {
      // console.log("beforeDeleteSchedule", e);
      dbDeleteSchedule(e.schedule.id)
    },
    afterRenderSchedule: function (e) {
      var schedule = e.schedule;
      // var element = cal.getElement(schedule.id, schedule.calendarId);
      // console.log("afterRenderSchedule", element);
    }
  });

      /**
     * Get time template for time and all-day
     * @param {Schedule} schedule - schedule
     * @param {boolean} isAllDay - isAllDay or hasMultiDates
     * @returns {string}
     */
    function getTimeTemplate(schedule, isAllDay) {
      var html = [];
      var start = moment(schedule.start.toUTCString());
      if (!isAllDay) {
          html.push('<strong>' + start.format('HH:mm') + '</strong> ');
      }
      if (schedule.isPrivate) {
          html.push('<span class="calendar-font-icon ic-lock-b"></span>');
          html.push(' Private');
      } else {
          if (schedule.isReadOnly) {
              html.push('<span class="calendar-font-icon ic-readonly-b"></span>');
          } else if (schedule.recurrenceRule) {
              html.push('<span class="calendar-font-icon ic-repeat-b"></span>');
          } else if (schedule.attendees.length) {
              html.push('<span class="calendar-font-icon ic-user-b"></span>');
          } else if (schedule.location) {
              html.push('<span class="calendar-font-icon ic-location-b"></span>');
          }
          html.push(' ' + schedule.title);
      }

      return html.join('');
  }

  /**
   * A listener for click the menu
   * @param {Event} e - click event
   */

  function onClickMenu(e) {
    var target = $(e.target).closest('a[role="menuitem"]')[0];
    var action = getDataAction(target);
    var options = cal.getOptions();
    var viewName = "";

    // console.log(target);
    // console.log(action);
    switch (action) {
      case "toggle-daily":
        viewName = "day";
        break;
      case "toggle-weekly":
        viewName = "week";
        break;
      case "toggle-monthly":
        options.month.visibleWeeksCount = 0;
        viewName = "month";
        break;
      default:
        break;
    }

    cal.setOptions(options, true);
    cal.changeView(viewName, true);

    setRenderRangeText();
    setSchedules();
  }

  function onClickNavi(e) {
    var action = getDataAction(e.target);

    switch (action) {
      case "move-prev":
        cal.prev();
        break;
      case "move-next":
        cal.next();
        break;
      case "move-today":
        cal.today();
        break;
      default:
        return;
    }

    setRenderRangeText();
    setSchedules();
  }

function createNewSchedule(event) {
    var start = event.start ? new Date(event.start.getTime()) : new Date();
    var end = event.end ? new Date(event.end.getTime()) : moment().add(1, 'hours').toDate();

    if (useCreationPopup) {
        cal.openCreationPopup({
            start: start,
            end: end
        });
    }
}

  async function dbSaveNewSchedule(scheduleData) {
    var calendar =
      scheduleData.calendar || findCalendar(scheduleData.calendarId);
    var calendarId = document.querySelector('#user-id').textContent;
    var schedule = {
      calendarId: calendarId,
      title: scheduleData.title,
      isAllDay: scheduleData.isAllDay,
      start: (scheduleData.start).toDate(),
      end: (scheduleData.end).toDate(),
      category: "allday",
      category: scheduleData.isAllDay ? "allday" : "time",
      dueDateClass: "",
      color: calendar.color,
      bgColor: calendar.bgColor,
      dragBgColor: calendar.bgColor,
      borderColor: calendar.borderColor,
      location: scheduleData.location,
      raw: {
        class: scheduleData.raw["class"],
        location: scheduleData.location
      },
      state: scheduleData.state,
    };
    if(schedule.isAllDay) {
      schedule.end = schedule.start;
    }
    const response = await fetch('/api/events', {
      method: "POST",
      body: JSON.stringify(schedule),
      headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
      document.location.replace('/');
    } else {
        alert(response.statusText)
    }
  };

  async function dbUpdateSchedule(scheduleId, changes) {
    var calendarId = document.querySelector('#user-id').textContent;
    if(changes.start) {
      changes.start = (changes.start).toDate();
    }
    if(changes.end) {
      changes.end = (changes.end).toDate();
    }
    if(changes.isAllDay) {
      changes.category = 'allday';
      changes.end = changes.start;
    } else {
      changes.category = 'time'
    }
    changes.calendarId = parseInt(calendarId)

    const response = await fetch(`/api/events/${scheduleId}`, {
      method: "PUT",
      body: JSON.stringify(changes),
      headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
      document.location.replace('/');
    } else {
        alert(response.statusText)
    }
  };

  async function dbDeleteSchedule(scheduleId) {
    const response = await fetch(`/api/events/${scheduleId}`, {
      method: "DELETE"
    });
    if (response.ok) {
      document.location.replace('/');
    } else {
        alert(response.statusText)
    }
  };

  function refreshScheduleVisibility() {
    var calendarElements = Array.prototype.slice.call(
      document.querySelectorAll("#calendarList input")
    );

    CalendarList.forEach(function (calendar) {
      cal.toggleSchedules(calendar.id, !calendar.checked, false);
    });

    cal.render(true);

    calendarElements.forEach(function (input) {
      var span = input.nextElementSibling;
      span.style.backgroundColor = input.checked
        ? span.style.borderColor
        : "transparent";
    });
  }

  function setRenderRangeText() {
    var renderRange = document.getElementById("renderRange");
    var options = cal.getOptions();
    var viewName = cal.getViewName();
    var html = [];
    if (viewName === "day") {
      html.push(moment(cal.getDate().getTime()).format("DD MMM YYYY"));
    } else if (
      viewName === "month" &&
      (!options.month.visibleWeeksCount || options.month.visibleWeeksCount > 4)
    ) {
      html.push(moment(cal.getDate().getTime()).format("MMM YYYY"));
    } else {
      html.push(
        moment(cal.getDateRangeStart().getTime()).format("DD MMM")
      );
      html.push(" - ");
      html.push(moment(cal.getDateRangeEnd().getTime()).format(" DD MMM YYYY"));
    }
    renderRange.innerHTML = html.join("");
  }

  async function setSchedules() {
    cal.clear();
    var schedules = await GetMyEvents();
    // console.log(schedules);
    await cal.createSchedules(schedules);
    refreshScheduleVisibility();
  }

  function setEventListener() {
    $("#menu-navi").on("click", onClickNavi);
    $('.dropdown-menu a[role="menuitem"]').on("click", onClickMenu);
    $("#btn-new-schedule").on("click", createNewSchedule);
    window.addEventListener("resize", resizeThrottled);
  }

  function getDataAction(target) {
    return target.dataset
      ? target.dataset.action
      : target.getAttribute("data-action");
  }

  resizeThrottled = tui.util.throttle(function () {
    cal.render();
  }, 50);

  window.cal = cal;

  setRenderRangeText();
  setSchedules();
  setEventListener();
})(window, tui.Calendar);