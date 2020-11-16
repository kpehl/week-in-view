// A function to update a task status
async function updateTaskStatusHandler(event) {
    event.preventDefault();

    let taskItem = $(this).parent('.task-list-item');
    console.log(taskItem)

    // get the task id from the clicked on task
    var taskID = $(this).siblings('.task-id').text();
    console.log('update button clicked')
    console.log(taskID)

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
        alert(response.statusText)
    }

}

let task_list = document.querySelector('.task-list-group')
let statusBtns = document.querySelectorAll('.status-btn')
statusBtns.forEach(function (i) {
    i.addEventListener('click', updateTaskStatusHandler)
})