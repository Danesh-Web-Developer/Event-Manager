const errorElement = document.getElementById("error");
const message = document.createElement("p");
message.setAttribute("class", "p");
errorElement.appendChild(message);

const signup = () => {
    let firstname = document.getElementById("firstname").value;
    let lastname = document.getElementById("lastname").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let loader = document.getElementById("loader");
    let buttonText = document.getElementById("buttonText");


    if (firstname && lastname && email && password) {
        loader.style.display = "inline-block";
        buttonText.style.display = "none";
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                var user = userCredential.user;
                let userid = user.uid

                const db = firebase.firestore()
                db.collection("Users").doc(userid).set({
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    password: password
                })
                    .then(() => {
                        console.log("Document successfully written!");
                        window.location.replace("../index.html")
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
            })
            .catch((error) => {
                var errmessage = error.message
                message.innerText = errmessage
                loader.style.display = "none";
                buttonText.style.display = "inline";
                allertTime()
            });
    } else {
        message.innerText = "All field or required..."
        allertTime()
    }

    function allertTime() {
        setTimeout(() => {
            message.innerText = "";
        }, 3000);
    }
}