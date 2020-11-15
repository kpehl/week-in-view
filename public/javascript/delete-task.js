// A function to delete a task
async function deleteTaskHandler(event) {
    event.preventDefault();

    let taskItem = $(this).parent('.task-list-item');
    console.log(taskItem)

    // get the task id from the clicked on task
    var taskID = $(this).siblings('.task-id').text();
    console.log('delete button clicked')
    console.log(taskID)
}

let task_list = document.querySelector('.task-list-group')
let delBtns = document.querySelectorAll('.delete-btn')
delBtns.forEach(function (i) {
    i.addEventListener('click', deleteTaskHandler)
})