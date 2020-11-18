////  Copied from https://codepen.io/AnzilkhaN/pen/GRJqPVK

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

function hexToRGBA(hex) {
  var radix = 16;
  var r = parseInt(hex.slice(1, 3), radix),
    g = parseInt(hex.slice(3, 5), radix),
    b = parseInt(hex.slice(5, 7), radix),
    a = parseInt(hex.slice(7, 9), radix) / 255 || 1;
  var rgba = "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";

  return rgba;
}

async function GetUser() {
  /*     const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ]; */
  //fetch(`/api/users/${id}`)
  const user_id = document.querySelector('#user-id').textContent;
  const response = await fetch(`/api/users/${user_id}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      return json.id;
    });
    console.log(response);
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
          console.log('GET MY EVENTS', events)
          return events;
        })
        return response;
}

(function () {
  var calendar;
  var id = 0;

  // Create calendar for User from Database

  // get user 1 for testing
  calendar = new CalendarInfo();
  /*   id += 1;
  calendar.id = String(id); */
  calendar.id = GetUser();
  calendar.name = "Events";
  calendar.color = "#FF8C1A";
  calendar.bgColor = "#FDF8F3";
  calendar.dragBgColor = "#FDF8F3";
  calendar.borderColor = "#FDF8F3";
  addCalendar(calendar);

  // calendar = new CalendarInfo();
  // id += 1;
  // calendar.id = String(id);
  // calendar.name = 'Offer';
  // calendar.color = '#578E1C';
  // calendar.bgColor = '#EEF8F0';
  // calendar.dragBgColor = '#EEF8F0';
  // calendar.borderColor = '#EEF8F0';
  // addCalendar(calendar);

  /*   calendar = new CalendarInfo();
  id += 1;
  calendar.id = String(id);
  calendar.name = "Holidays";
  calendar.color = "#578E1C";
  calendar.bgColor = "#EEF8F0";
  calendar.dragBgColor = "#EEF8F0";
  calendar.borderColor = "#EEF8F0";
  addCalendar(calendar); */
})();

(function (window, Calendar) {
  var cal, resizeThrottled;
  var useCreationPopup = true;
  var useDetailPopup = true;
  var datePicker, selectedCalendar;

  cal = new Calendar("#calendar", {
    defaultView: "week",
    taskView: false,
    useCreationPopup: true,
    useDetailPopup: true,
    calendars: CalendarList,
    template: {
      milestone: function (schedule) {
        return (
          '<span class="calendar-font-icon ic-milestone-b"></span> <span style="background-color: ' +
          schedule.bgColor +
          '">' +
          schedule.title +
          "</span>"
        );
      },
      milestoneTitle: function () {
        return '<span class="tui-full-calendar-left-content">MILESTONE</span>';
      },
      task: function (schedule) {
        return "#" + schedule.title;
      },
      taskTitle: function () {
        return '<span class="tui-full-calendar-left-content">TASK</span>';
      },
      allday: function (schedule) {
        return getTimeTemplate(schedule, true);
      },
      alldayTitle: function () {
        return '<span class="tui-full-calendar-left-content">ALL DAY</span>';
      },
      time: function (schedule) {
        return (
          "<strong>" +
          moment(schedule.start.getTime()).format("HH:mm") +
          "</strong> " +
          schedule.title
        );
      },
      goingDuration: function (schedule) {
        return (
          '<span class="calendar-icon ic-travel-time"></span>' +
          schedule.goingDuration +
          "min."
        );
      },
      comingDuration: function (schedule) {
        return (
          '<span class="calendar-icon ic-travel-time"></span>' +
          schedule.comingDuration +
          "min."
        );
      },
      monthMoreTitleDate: function (date, dayname) {
        var day = date.split(".")[2];

        return (
          '<span class="tui-full-calendar-month-more-title-day">' +
          day +
          '</span> <span class="tui-full-calendar-month-more-title-day-label">' +
          dayname +
          "</span>"
        );
      },
      monthMoreClose: function () {
        return '<span class="tui-full-calendar-icon tui-full-calendar-ic-close"></span>';
      },
      monthGridHeader: function (dayModel) {
        var date = parseInt(dayModel.date.split("-")[2], 10);
        var classNames = ["tui-full-calendar-weekday-grid-date "];

        if (dayModel.isToday) {
          classNames.push("tui-full-calendar-weekday-grid-date-decorator");
        }

        return '<span class="' + classNames.join(" ") + '">' + date + "</span>";
      },
      monthGridHeaderExceed: function (hiddenSchedules) {
        return (
          '<span class="weekday-grid-more-schedules">+' +
          hiddenSchedules +
          "</span>"
        );
      },
      monthGridFooter: function () {
        return "";
      },
      monthGridFooterExceed: function (hiddenSchedules) {
        return "";
      },
      monthDayname: function (model) {
        return model.label.toString().toLocaleUpperCase();
      },
      weekDayname: function (model) {
        return (
          '<span class="tui-full-calendar-dayname-date">' +
          model.date +
          '</span>&nbsp;&nbsp;<span class="tui-full-calendar-dayname-name">' +
          model.dayName +
          "</span>"
        );
      },
      weekGridFooterExceed: function (hiddenSchedules) {
        return "+" + hiddenSchedules;
      },
      dayGridTitle: function (viewName) {
        // use another functions instead of 'dayGridTitle'
        // milestoneTitle: function() {...}
        // taskTitle: function() {...}
        // alldayTitle: function() {...}

        var title = "";
        switch (viewName) {
          case "milestone":
            title =
              '<span class="tui-full-calendar-left-content">MILESTONE</span>';
            break;
          case "task":
            title = '<span class="tui-full-calendar-left-content">TASK</span>';
            break;
          case "allday":
            title =
              '<span class="tui-full-calendar-left-content">ALL DAY</span>';
            break;
        }

        return title;
      },
      // schedule: function(schedule) {

      //     // use another functions instead of 'schedule'
      //     // milestone: function() {...}
      //     // task: function() {...}
      //     // allday: function() {...}

      //     var tpl;

      //     switch(category) {
      //         case 'milestone':
      //             tpl = '<span class="calendar-font-icon ic-milestone-b"></span> <span style="background-color: ' + schedule.bgColor + '">' + schedule.title + '</span>';
      //             break;
      //         case 'task':
      //             tpl = '#' + schedule.title;
      //             break;
      //         case 'allday':
      //             tpl = getTimeTemplate(schedule, true);
      //             break;
      //     }

      //     return tpl;
      // },
      collapseBtnTitle: function () {
        return '<span class="tui-full-calendar-icon tui-full-calendar-ic-arrow-solid-top"></span>';
      },
      // timezoneDisplayLabel: function(timezoneOffset, displayLabel) {
      //     var gmt, hour, minutes;

      //     if (!displayLabel) {
      //         gmt = timezoneOffset < 0 ? '-' : '+';
      //         hour = Math.abs(parseInt(timezoneOffset / 60, 10));
      //         minutes = Math.abs(timezoneOffset % 60);
      //         displayLabel = gmt + getPadStart(hour) + ':' + getPadStart(minutes);
      //     }

      //     return displayLabel;
      // },
      // timegridDisplayPrimayTime: function(time) {
      //     // will be deprecated. use 'timegridDisplayPrimaryTime'
      //     var meridiem = 'am';
      //     var hour = time.hour;

      //     if (time.hour > 12) {
      //         meridiem = 'pm';
      //         hour = time.hour - 12;
      //     }

      //     return hour + ' ' + meridiem;
      // },
      timegridDisplayPrimaryTime: function (time) {
        var meridiem = "am";
        var hour = time.hour;

        if (time.hour > 12) {
          meridiem = "pm";
          hour = time.hour - 12;
        }

        return hour + " " + meridiem;
      },
      timegridDisplayTime: function (time) {
        return getPadStart(time.hour) + ":" + getPadStart(time.hour);
      },
      timegridCurrentTime: function(time) {
          var templates = [];
          templates.push(moment(time.hour).format('h:mm a'));
          return templates.join('');
      },
      popupIsAllDay: function () {
        return "All Day";
      },
      popupStateFree: function () {
        return "Free";
      },
      popupStateBusy: function () {
        return "Busy";
      },
      titlePlaceholder: function () {
        return "Subject";
      },
      locationPlaceholder: function () {
        return "Location";
      },
      startDatePlaceholder: function () {
        return "Start date";
      },
      endDatePlaceholder: function () {
        return "End date";
      },
      popupSave: function () {
        return "Save";
      },
      popupUpdate: function () {
        return "Update";
      },
      popupDetailDate: function (isAllDay, start, end) {
        var isSameDate = moment(start).isSame(end);
        var endFormat = (isSameDate ? "" : "YYYY.MM.DD ") + "hh:mm a";

        if (isAllDay) {
          return (
            moment(start).format("YYYY.MM.DD") +
            (isSameDate ? "" : " - " + moment(end).format("YYYY.MM.DD"))
          );
        }

        return (
          moment(start).format("YYYY.MM.DD hh:mm a") +
          " - " +
          moment(end).format(endFormat)
        );
      },
      popupDetailLocation: function (schedule) {
        return "Location : " + schedule.location;
      },
      popupDetailUser: function (schedule) {
        return "User : " + (schedule.attendees || []).join(", ");
      },
      popupDetailState: function (schedule) {
        return "State : " + schedule.state || "Busy";
      },
      popupDetailRepeat: function (schedule) {
        return "Repeat : " + schedule.recurrenceRule;
      },
      popupDetailBody: function (schedule) {
        return "Body : " + schedule.body;
      },
      popupEdit: function () {
        return "Edit";
      },
      popupDelete: function () {
        return "Delete";
      },
    },
  });

  // event handlers
  cal.on({
    clickMore: function (e) {
      console.log("clickMore", e);
    },
    clickSchedule: function (e) {
      var topValue;
      var leftValue;
      topValue = e.event.clientY / 2 + 45;
      leftValue = e.event.clientX;
      if (e.schedule.calendarId === "1") {
        console.log("clickSchedule", e.schedule.calendarId);
        $("#post").fadeIn();
        $("#offer").fadeOut();
        $("#event").fadeOut();
        $("#create").fadeOut();
        $(".promo_card").css({
          top: topValue,
          left: leftValue,
        });
        return;
      }
      if (e.schedule.calendarId === "2") {
        console.log("clickSchedule", e.schedule.calendarId);
        $("#event").fadeIn();
        $("#post").fadeOut();
        $("#offer").fadeOut();
        $("#create").fadeOut();
        $(".promo_card").css({
          top: topValue,
          left: leftValue,
        });
        return;
      }
      if (e.schedule.calendarId === "3") {
        console.log("clickSchedule", e.schedule.calendarId);
        $("#offer").fadeIn();
        $("#post").fadeOut();
        $("#event").fadeOut();
        $("#create").fadeOut();
        $(".promo_card").css({
          top: topValue,
          left: leftValue,
        });
        return;
      }
      console.log("ada ", e.event.clientX);
      if (e.event.clientX > window.windth - 200) {
      }
      console.log("clickSchedule", e);
    },
    clickDayname: function (date) {
      console.log("clickDayname", date);
    },
    beforeCreateSchedule: function (e) {
      // $("#create").fadeIn();

      dbSaveNewSchedule(e);
      //saveNewSchedule(e);
    },
    beforeUpdateSchedule: function (e) {
      var schedule = e.schedule;
      var changes = e.changes;

      console.log("beforeUpdateSchedule", e);

      dbUpdateSchedule(schedule.id, changes);

      // cal.updateSchedule(schedule.id, schedule.calendarId, changes);
      // refreshScheduleVisibility();
    },
    beforeDeleteSchedule: function (e) {
      console.log("beforeDeleteSchedule", e);
      // cal.deleteSchedule(e.schedule.id, e.schedule.calendarId);
      dbDeleteSchedule(e.schedule.id)
    },
    afterRenderSchedule: function (e) {
      var schedule = e.schedule;
      var element = cal.getElement(schedule.id, schedule.calendarId);
      // console.log("afterRenderSchedule", element);
    },
    clickTimezonesCollapseBtn: function (timezonesCollapsed) {
      // console.log("timezonesCollapsed", timezonesCollapsed);

      if (timezonesCollapsed) {
        cal.setTheme({
          "week.daygridLeft.width": "77px",
          "week.timegridLeft.width": "77px",
        });
      } else {
        cal.setTheme({
          "week.daygridLeft.width": "60px",
          "week.timegridLeft.width": "60px",
        });
      }

      return true;
    },
  });

  function getTimeTemplate(schedule, isAllDay) {
    var html = [];
    var start = moment(schedule.start.toUTCString());
    if (!isAllDay) {
      html.push("<strong>" + start.format("HH:mm") + "</strong> ");
    }
    if (schedule.isPrivate) {
      html.push('<span class="calendar-font-icon ic-lock-b"></span>');
      html.push(" Private");
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
      html.push(" " + schedule.title);
    }

    return html.join("");
  }

  function onClickMenu(e) {
    var target = $(e.target).closest('a[role="menuitem"]')[0];
    var action = getDataAction(target);
    var options = cal.getOptions();
    var viewName = "";

    console.log(target);
    console.log(action);
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

  function onNewSchedule() {
    var title = $("#new-schedule-title").val();
    var location = $("#new-schedule-location").val();
    var isAllDay = document.getElementById("new-schedule-allday");
    var start = timePicker.getStartDate();
    var end = timePicker.getEndDate();
    var calendar = selectedCalendar ? selectedCalendar : CalendarList[0];

    if (!title) {
      return;
    }

    console.log("calendar.id ", calendar.id);
    cal.createSchedules([
      {
        id: "1",
        calendarId: calendar.id,
        title: title,
        isAllDay: isAllDay,
        start: start,
        end: end,
        category: isAllDay ? "allday" : "time",
        dueDateClass: "",
        color: calendar.color,
        bgColor: calendar.bgColor,
        dragBgColor: calendar.bgColor,
        borderColor: calendar.borderColor,
        raw: {
          location: location,
        },
        state: "Busy",
      },
    ]);

    $("#modal-new-schedule").modal("hide");
  }

  function onChangeNewScheduleCalendar(e) {
    var target = $(e.target).closest('a[role="menuitem"]')[0];
    var calendarId = getDataAction(target);
    changeNewScheduleCalendar(calendarId);
  }

  function changeNewScheduleCalendar(calendarId) {
    var calendarNameElement = document.getElementById("calendarName");
    var calendar = findCalendar(calendarId);
    var html = [];

    html.push(
      '<span class="calendar-bar" style="background-color: ' +
        calendar.bgColor +
        "; border-color:" +
        calendar.borderColor +
        ';"></span>'
    );
    html.push('<span class="calendar-name">' + calendar.name + "</span>");

    calendarNameElement.innerHTML = html.join("");

    selectedCalendar = calendar;
  }

  function createNewSchedule(event) {
    var start = event.start ? new Date(event.start.getTime()) : new Date();
    var end = event.end
      ? new Date(event.end.getTime())
      : moment().add(1, "hours").toDate();

    if (useCreationPopup) {
      cal.openCreationPopup({
        start: start,
        end: end,
      });
    }
  }
  function saveNewSchedule(scheduleData) {
    console.log("scheduleData ", scheduleData);
    var calendar =
      scheduleData.calendar || findCalendar(scheduleData.calendarId);
    var schedule = {
      id: "1",
      title: scheduleData.title,
      isAllDay: scheduleData.isAllDay,
      start: scheduleData.start,
      end: scheduleData.end,
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
      },
      state: scheduleData.state,
    };
    if (calendar) {
      schedule.calendarId = calendar.id;
      schedule.color = calendar.color;
      schedule.bgColor = calendar.bgColor;
      schedule.borderColor = calendar.borderColor;
    }

    cal.createSchedules([schedule]);

    refreshScheduleVisibility();
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
      },
      state: scheduleData.state,
    };
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
    console.log(schedules);
    // generateSchedule(cal.getViewName(), cal.getDateRangeStart(), cal.getDateRangeEnd());
    await cal.createSchedules(schedules);
    // cal.createSchedules(schedules);
    refreshScheduleVisibility();
  }

  function setEventListener() {
    $("#menu-navi").on("click", onClickNavi);
    $('.dropdown-menu a[role="menuitem"]').on("click", onClickMenu);
    // $('#lnb-calendars').on('change', onChangeCalendars);

    $("#btn-save-schedule").on("click", onNewSchedule);
    $("#btn-new-schedule").on("click", createNewSchedule);

    // $('#dropdownMenu-calendars-list').on('click', onChangeNewScheduleCalendar);

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

  // setDropdownCalendarType();
  setRenderRangeText();
  setSchedules();
  setEventListener();
})(window, tui.Calendar);

// // set calendars
// (function() {
//     var calendarList = document.getElementById('calendarList');
//     var html = [];
//     CalendarList.forEach(function(calendar) {
//         html.push('<div class="lnb-calendars-item"><label>' +
//             '<input type="checkbox" class="tui-full-calendar-checkbox-round" value="' + calendar.id + '" checked>' +
//             '<span style="border-color: ' + calendar.borderColor + '; background-color: ' + calendar.borderColor + ';"></span>' +
//             '<span>' + calendar.name + '</span>' +
//             '</label></div>'
//         );
//     });
//     calendarList.innerHTML = html.join('\n');
// })();
