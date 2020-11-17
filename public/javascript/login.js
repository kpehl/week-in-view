// Login form handler
async function loginFormHandler(event) {
    event.preventDefault();

    // get the information from the login form
    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();

    // if both fields have content
    if (email && password) {
        // POST to the login route with the user information
        const response = await fetch('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                email,
                password
            }),
            headers: {'Content-Type': 'application/json'}
        });
        // when the fetch promise is fufilled, check the response status; if the response is good, load the dashboard; if there is an error, alert with the status
        if (response.ok) {
            document.location.replace('/home');
        } else {
            let result = await response.json()
            alert(result.message)
        }
    }
}

document.querySelector('.login-form').addEventListener('submit', loginFormHandler);