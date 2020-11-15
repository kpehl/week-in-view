const Calendar = require('tui-calendar');


async function getUserInfo(userid) {
  const response = await fetch("/api/users/" + userid);
  if (response.ok) {
    let userData = response.json();
    return userData;
  } else {
    alert(response.statusText);
  }
}

async function getEvents(userid) {
  let userData = await getUserInfo(userid);
  let userEvents = userData.events;
  let events = userEvents.map((event) => {
    let monthStr,
      dayStr,
      hourStr,
      minStr = "";
    if (event.month.toString().length < 2) {
      monthStr = "0" + event.month;
    } else {
      monthStr = event.month;
    }
    if (event.day.toString().length < 2) {
      dayStr = "0" + event.day;
    } else {
      dayStr = event.day;
    }
    if (event.hour.toString().length < 2) {
      hourStr = "0" + event.hour;
    } else {
      hourStr = event.hour;
    }
    if (event.minute.toString().length < 2) {
      minStr = "0" + event.minute;
    } else {
      minStr = event.minute;
    }
    let startString =
      event.year + "-" + monthStr + "-" + dayStr + "T" + hourStr + ":" + minStr;
    let eventObj = { title: event.title, start: startString };
    return eventObj;
  });
  return events;
}

function renderCalendar(event) {
  let staticEventArray = [
    {
      title: "Dentist appointment",
      start: "2020-11-20T09:30",
    },
  ];
  //let eventArray = getEvents(2);
  console.log(staticEventArray);
  //console.log(eventArray);
  //var calendarEl = document.getElementById("calendar");
  var calendar = new Calendar(document.getElementById('calendar'), {
    id: this.id,
     defaultView: 'week',
     taskView: true,    // Can be also ['milestone', 'task']
     scheduleView: true,  // Can be also ['allday', 'time']
     template: {
         milestone: function(schedule) {
             return '<span style="color:red;"><i class="fa fa-flag"></i> ' + schedule.title + '</span>';
         },
         milestoneTitle: function() {
             return 'Milestone';
         },
         task: function(schedule) {
             return '&nbsp;&nbsp;#' + schedule.title;
         },
         taskTitle: function() {
             return '<label><input type="checkbox" />Task</label>';
         },
         allday: function(schedule) {
             return schedule.title + ' <i class="fa fa-refresh"></i>';
         },
         alldayTitle: function() {
             return 'All Day';
         },
         time: function(schedule) {
             return schedule.title + ' <i class="fa fa-refresh"></i>' + schedule.start;
         }
     },
     month: {
         daynames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
         startDayOfWeek: 0,
         narrowWeekend: true
     },
     week: {
         daynames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
         startDayOfWeek: 0,
         narrowWeekend: true
     },
 });
 calendar.createSchedules([
  {
      id: '1',
      calendarId: '1',
      title: 'my schedule',
      category: 'time',
      dueDateClass: '',
      start: '2020-11-13T12:30:00+09:00',
      end: '2020-11-13T02:30:00+09:00'
  },
  {
      id: '2',
      calendarId: '1',
      title: 'second schedule',
      category: 'time',
      dueDateClass: '',
      start: '2020-11-13T17:30:00+09:00',
      end: '2020-11-13T18:31:00+09:00',
      isReadOnly: true    // schedule is read-only
  },
  {
    id: '3',
    calendarId: '1',
    title: 'third schedule',
    category: 'time',
    dueDateClass: '',
    start: '2020-11-14T17:30:00+09:00',
    end: '2020-11-14T18:31:00+09:00',
    isReadOnly: true    // schedule is read-only
}
]);
 
//  calendar.render();
}

document.addEventListener("DOMContentLoaded", renderCalendar);
