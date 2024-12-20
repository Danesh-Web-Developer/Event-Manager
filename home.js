const logout = () => {
    const user = firebase.auth().currentUser;
    if (user) {
        const db = firebase.firestore();
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const userid = user.uid;
                console.log("User is signed in:", userid);
                db.collection("Current user").doc(userid).delete().then(() => {
                    firebase.auth().signOut().then(() => {
                        console.log("success");

                    }).catch((error) => {
                        console.log("error");

                    });
                    window.location.replace('./index.html')
                }).catch((error) => {
                    console.error("Error removing document: ", error);

                })
            } else {
                console.log("No user is currently signed in");
            }
        });
    };
};

const container = document.getElementById("container");
const row = document.getElementById("row")
container.appendChild(row);

const getData = () => {
    const loader = document.getElementById("loader");
    loader.style.display = "flex";
    row.style.display = "none";
    const db = firebase.firestore();
    db.collection("Events").get().then((querySnapshot) => {
        loader.style.display = "none";
        row.style.display = "flex";
        querySnapshot.forEach((doc) => {

            var col = document.createElement("col");
            col.setAttribute("class", "col-lg-3 col-md-6 col-12");
            row.appendChild(col);

            var card = document.createElement("div");
            card.setAttribute("class", "card mb-4");
            col.appendChild(card);

            const image = document.createElement("img");
            image.src = doc.data().image;
            image.alt = "Event Image";
            image.setAttribute("class", "img")
            card.appendChild(image);

            var Cardbody = document.createElement("div");
            Cardbody.setAttribute("class", "card-body");
            card.appendChild(Cardbody);

            var title = document.createElement("h3");
            title.setAttribute("class", "card-title");
            title.innerText = doc.data().title;
            Cardbody.appendChild(title);

            var desc = document.createElement("h6");
            desc.setAttribute("class", "card-text mt-3");
            desc.innerText = doc.data().description;
            Cardbody.appendChild(desc);

            let date = document.createElement("p");
            date.setAttribute("class", "card-text mt-3");
            let eventDate = doc.data().eventDate;
            if (eventDate) {
                const formattedDate = new Date(eventDate.seconds * 1000).toLocaleString();
                date.innerText = `Date: ${ formattedDate }`;
            } else {
                date.innerText = "Date: Not Available";
            }
            Cardbody.appendChild(date);

        });
    });
}

const currusername = () => {
    let curntusername = document.getElementById("currentusername")
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            const useremail = user.email;
            const db = firebase.firestore();

            db.collection("Users")
                .where("email", "==", useremail)
                .get()
                .then((querySnapshot) => {
                    if (querySnapshot.empty) {
                        console.log("No username found for the current user.");
                    } else {
                        querySnapshot.forEach((doc) => {
                            let firstname = doc.data().firstname
                            let lastname = doc.data().lastname
                            let fullname = firstname + " " + lastname
                            curntusername.innerText = fullname
                        });
                    }
                })
                .catch((error) => {
                    console.error("Error fetching user events:", error);
                });
        } else {
            console.log("User is not authenticated. Redirect to login page.");
        }
    });
}

