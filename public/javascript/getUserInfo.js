async function getEvents(userid) {
    const response = await fetch('/api/users/' + userid)
    if (response.ok) {
        let userData = response.json()
        console.log(userData)
        return userData;
    } else {
        alert(response.statusText)
    }
};