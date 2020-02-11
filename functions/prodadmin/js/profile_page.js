function profile_page() {
    //gblPageContent.innerHTML = `<h1>Profile page</h1>`;
    profile_page_secured();
    //create_profile();
}

async function profile_page_secured() {
    gblPageContent.innerHTML = `<h1>Profile page</h1>`;
    let profile = await getProfile();
    let name = 'test name';
    let bio = 'test bio';
    if (profile != null) {
        name = profile.name;
        bio = profile.bio;
        
    }
    console.log("profile", '=>', profile);
    gblPageContent.innerHTML = `<h1>User Profile</h1>`;
    gblPageContent.innerHTML += `
    <button class="btn btn-primary" type="button" onclick="getProfile()">TEST getProfile()</button>
    <a href='/home' class="btn btn-outline-primary">Home</a>
    <a href='/add' class="btn btn-outline-primary">Add Product</a>
    <a href='/show' class="btn btn-outline-primary">Show Products</a>
    <div class="form-group">
        Name: <input class="form-control" type="text" id="name" placeholder="${name}"/>
        <p id="name_error" style="color:red;" />
    </div>
    <div class="form-group">
        Bio: <br>
        <textarea class="form-control"  id="bio" cols="40" rows="5" placeholder="${bio}"></textarea>
        <p id="bio_error" style="color:red;" />
    </div>
    <div class="form-group">
        Profile Picture: <input type="file" id="imageButton" value="upload"/>
        <p id="image_error" style="color:red;" />
    </div>
    <button class="btn btn-primary" type="button" onclick="updateProfile()">Update Profile</button>
    
    `;
    const imageButton = document.getElementById('imageButton');
    imageButton.addEventListener('change', e => {
        gblImageFile = e.target.files[0];
        console.log('fileupload', e.target.files[0])
    })
}
function getProfile() {
    const promise = new Promise(function (resolve, reject) {
        //Change how this works later
        //++++++++++++++++++++++++++++++++++++
        let profileId = 000000;
        //++++++++++++++++++++++++++++++++++++

        let profileRef = firebase.firestore().collection(PROF_COLLECTION)
        let query = profileRef.where('profileId', '==', profileId).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No matching documents.');
                    resolve(null);
                }

                snapshot.forEach(doc => {
                    console.log(doc.id, '=>', doc.data());
                    let profile1 = doc.data();
                    resolve(profile1);
                });
            })
            .catch(err => {
                console.log('Error getting documents', err);
                reject(err);
            })
    });
    return promise;
}
async function updateProfile() {
    //Change how this works later
    //++++++++++++++++++++++++++++++++++++
    let profileId = 000000;
    //++++++++++++++++++++++++++++++++++++

    const name = document.getElementById('name').value;
    const bio = document.getElementById('bio').value;

    const nameErrorTg = document.getElementById('name_error');
    const bioErrorTg = document.getElementById('bio_error');
    const imageErrorTg = document.getElementById('image_error');

    //validate input
    nameErrorTg.innerHTML = validate_name(name);
    bioErrorTg.innerHTML = validate_summary(bio);
    if (!gblImageFile) {
        imageErrorTg.innerHTML = "Error: Image file not Selected";
    }
    else
        imageErrorTg.innerHTML = null;

    if (nameErrorTg.innerHTML || bioErrorTg.innerHTML || imageErrorTg.innerHTML) {
        return;
    }

    try {
        const image = Date.now() + gblImageFile.name;
        const ref = firebase.storage().ref(PROF_PIC_FOLDER + image);
        const taskSnapshot = await ref.put(gblImageFile);
        const image_url = await taskSnapshot.ref.getDownloadURL();

        await firebase.firestore().collection(PROF_COLLECTION).doc().set({ profileId, name, bio, image, image_url })

        gblPageContent.innerHTML = `
            <h1>profile had been updated!</h1>
            <a href='/home' class='btn btn-outline-primary'>home</a>
        `;
    }
    catch (e) {
        gblPageContent.innerHTML = `
            <h1>Cannot update profile</h1>
            ${JSON.stringify(e)}
        `;
        console.log(e);
    }
}