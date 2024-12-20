const errorElement = document.getElementById("error");
const message = document.createElement("p");
message.setAttribute("class", "p");
errorElement.appendChild(message);

const addevent = () => {
    let image = document.getElementById("image").value
    let title = document.getElementById("title").value
    let description = document.getElementById("description").value
    let date = document.getElementById("date").value
    let loader = document.getElementById("loader");
    let buttonText = document.getElementById("buttonText");

    if (image && title && description && date) {
        loader.style.display = "inline-block";
        buttonText.style.display = "none";
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const uid = user.uid;
                const email = user.email

                const db = firebase.firestore()
                db.collection("Events").add({
                    image: image,
                    title: title,
                    description: description,
                    date: date,
                    userid: uid,
                    userEmail: email,
                    eventDate: firebase.firestore.FieldValue.serverTimestamp()
                })
                    .then((docRef) => {
                        console.log("Document written with ID: ", docRef.id);
                        window.location.replace("./home.html")
                    })
                    .catch((error) => {
                        loader.style.display = "none";
                        buttonText.style.display = "inline";
                        console.error("Error adding document: ", error);
                        message.innerText = "Error adding document: ", error
                        allertTime()
                    });
            } else {
                message.innerText = "Enter Value..."
                allertTime()
            }
        });

    }
    else {
        message.innerText = "All field or required..."
        allertTime()
    }
    function allertTime() {
        setTimeout(() => {
            message.innerText = "";
        }, 3000);
    }
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