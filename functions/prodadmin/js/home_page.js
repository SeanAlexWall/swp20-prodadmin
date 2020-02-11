function home_page() {
    home_page_secured();
}

function home_page_secured() {
    gblPageContent.innerHTML = `<h1>HOME PAGE</h1>`
    gblPageContent.innerHTML += `
      <a href='/add' class="btn btn-outline-primary">Add A Product</a>
      <a href='/show' class="btn btn-outline-primary">Show Products</a>
      <a href='/profile' class="btn btn-outline-primary">Profile</a>
      <button class="btn btn-outline-danger" type="button" onclick="logOut()">Log out</button>
    `;
}

async function logOut() {
    try {
        await firebase.auth().signOut();
        window.location.href = '/login';
    }
    catch (e) {
        window.location.href = '/login';
    }
}