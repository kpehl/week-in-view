// A function to update a task status
async function updateTaskStatusHandler(event) {
    event.preventDefault();

    let taskItem = $(this).parent('.task-list-item');

    // get the task id from the clicked on task
    var taskID = $(this).siblings('.task-id').text();

    // get the status from the clicked on task
    var status = $(this).siblings('.task-status').text();

    // toggle the status of the task
    if (status == 'true') {status = false;}
    else {status = true;}


    // use the update task api to update the task status
    const response = await fetch(`/api/tasks/${taskID}`, {
        method: 'PUT',
        body: JSON.stringify ({
            status
        }),
        headers: {
          'Content-Type': 'application/json'
        }
    });
    if (response.ok) {
        document.location.reload();
    } else {
        alert(response.statusText);
    }

}

let statusBtns = document.querySelectorAll('.status-btn');
statusBtns.forEach(function (i) {
    i.addEventListener('click', updateTaskStatusHandler);
});