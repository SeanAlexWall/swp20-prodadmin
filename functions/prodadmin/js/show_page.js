function show_page() {
    show_page_secured();
}

let products; //list of products

async function show_page_secured() {
    gblPageContent.innerHTML = `<h1>SHOW PRODUCTS</h1>`
    gblPageContent.innerHTML += `
      <a href='/add' class="btn btn-outline-primary">Add A Product</a>
      <a href='/home' class="btn btn-outline-primary">Home</a>
      <br>
    `;


    try {
        products = [];
        const snapshot = await firebase.firestore().collection(COLLECTION).get();
        snapshot.forEach(document => {
            const { name, summary, price, image, image_url } = document.data();
            const product = { docId: document.id, name, summary, price, image, image_url };
            products.push(product);
        });
    }
    catch (e) {
        gblPageContent.innerHTML = "ERROR: <br>" + e;
        return;
    }
    console.log(products);

    if (products.length === 0) {
        gblPageContent.innerHTML += "<h1>No products</h1>";
        return;
    }

    for (let i = 0; i < products.length; i++) {
        gblPageContent.innerHTML += `
          <div id="${products[i].docId}" class="card" style="width: 18rem; display: inline-block" >
            <img src="${products[i].image_url}" class="card-img-top">
            <div class="card-body">
              <h5 class="card-title">${products[i].name}</h5>
              <p class="card-text">${products[i].price}<br>${products[i].summary}</p>
              <a href="#" class="btn btn-primary">Go somewhere</a>
            </div>
          </div>
        `;
    }
}