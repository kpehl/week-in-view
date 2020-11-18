// New Task Form Handler
async function newTaskFormHandler(event) {
    event.preventDefault();

    // Get the task text from the form
    const text = document.querySelector('input[name="task-text"]').value.trim();
    // Get user id 
    const user_id = document.querySelector('#user-id').textContent;

    // Use the add new task POST route to add the task to the database
    const response = await fetch('/api/tasks', {
        method: 'POST',
        body: JSON.stringify({
            text,
            user_id
        }),
        headers: {
            'Content-Type': 'application/json'
          }       
    });

    // if the response is ok, reload the page, showing the task in the task list; otherwise, display the error
    if (response.ok) {
        document.location.replace('/');
    } else {
        alert(response.statusText)
    }
}

// Event Listener for the submit button
document.querySelector('.new-task-form').addEventListener('submit', newTaskFormHandler)