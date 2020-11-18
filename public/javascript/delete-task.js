// A function to delete a task
async function deleteTaskHandler(event) {
    event.preventDefault();

    let taskItem = $(this).parent('.task-list-item');
    console.log(taskItem)

    // get the task id from the clicked on task
    var taskID = $(this).siblings('.task-id').text();
    console.log('delete button clicked')
    console.log(taskID)

    // use the delete task api to remove the task
    const response = await fetch(`/api/tasks/${taskID}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        document.location.reload();
    } else {
        alert(response.statusText)
    }

}

let task_list = document.querySelector('.task-list-group')
let delBtns = document.querySelectorAll('.delete-btn')
delBtns.forEach(function (i) {
    i.addEventListener('click', deleteTaskHandler)
})