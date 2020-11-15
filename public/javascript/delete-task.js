// A function to delete a task
async function deleteTaskHandler(event) {
    event.preventDefault();

    let target = event.target;

    // get the task id from the clicked on task
    // var taskID = $(this).siblings(".task-id");
    // console.log(taskID)
    console.log('button clicked')
}

let task_list = document.querySelector('.task-list-group')
let delBtns = document.querySelectorAll('.delete-btn')
delBtns.forEach(function (i) {
    i.addEventListener('click', deleteTaskHandler)
})