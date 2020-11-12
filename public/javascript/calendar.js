async function getUserInfo(userid) {
  const response = await fetch('/api/users/' + userid)
  if (response.ok) {
      let userData = response.json()
      return userData;
  } else {
      alert(response.statusText)
  }
};

async function getEvents(userid) {
  let userData = await getUserInfo(userid);
  let userEvents = userData.events;
  let events = userEvents.map(event => {
  	let monthStr, dayStr, hourStr, minStr = "";   
    if (event.month.toString().length < 2) {
      monthStr = '0' + event.month;
    } else {monthStr = event.month}
    if (event.day.toString().length < 2) {
      dayStr = '0' + event.day;
    } else {dayStr = event.day}
    if (event.hour.toString().length < 2) {
      hourStr = '0' + event.hour;
    } else {hourStr = event.hour}
    if (event.minute.toString().length < 2) {
      minStr = '0' + event.minute;
    } else {minStr = event.minute}
    let startString = event.year + '-' + monthStr + '-' + dayStr + 'T' + hourStr + ':' + minStr;
    let eventObj = { title: event.title, start: startString}
    return eventObj
  })
  return events;
}

function renderCalendar(event) {
    let staticEventArray = [
        {
          title: 'Dentist appointment',
          start: '2020-11-20T09:30'
        }
      ];
    let eventArray = getEvents(2);
    console.log(staticEventArray)
    console.log(eventArray)
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek,dayGridMonth'
            },
        events: eventArray
    });
    calendar.render();
}

document.addEventListener('DOMContentLoaded', renderCalendar)