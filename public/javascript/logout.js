// A function to log out a user
async function logout() {
    const response = await fetch('/api/users/logout', {
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    });
  
    if (response.ok) {
      document.location.replace('/');
    } else {
      alert(response.statusText);
    }
  }
  
  document.querySelector('#logout').addEventListener('click', logout);