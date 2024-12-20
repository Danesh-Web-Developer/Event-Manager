const createacc = () => {
  window.location.replace("./signup/signup.html")
}

const errorElement = document.getElementById("error");
const message = document.createElement("p");
message.setAttribute("class", "p");
errorElement.appendChild(message);

const login = () => {

  let email = document.getElementById("email").value
  let password = document.getElementById("password").value
  let loader = document.getElementById("loader");
  let buttonText = document.getElementById("buttonText");

  if (email && password) {
    loader.style.display = "inline-block";
    buttonText.style.display = "none";
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        var user = userCredential.user;
        let userid = user.uid

        const db = firebase.firestore()
        db.collection("Current user").doc(userid).set({
          email: email,
          password: password,
          userid: userid
        })
          .then(() => {
            console.log("Document successfully written!");
            window.location.replace("./home.html")
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });
      })
      .catch((error) => {
        let errorMessage = error.message;
        loader.style.display = "none";
        buttonText.style.display = "inline";
        allertTime()
        if (errorMessage === '{"error":{"code":400,"message":"INVALID_LOGIN_CREDENTIALS","errors":[{"message":"INVALID_LOGIN_CREDENTIALS","domain":"global","reason":"invalid"}]}}') {
          message.innerText = "Emial or Password Invaild"
          allertTime()
        } else {
          message.innerText = errorMessage
          allertTime()
        }
      });
  }
  else {
    message.innerText = "All field or required..."
    allertTime()
  }
}

const forgetpass = () => {
  let email = document.getElementById("email").value
  firebase.auth().sendPasswordResetEmail(email)
    .then(() => {
      console.log("success fully");

    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      message.innerText = errorMessage
    });
}

function allertTime() {
  setTimeout(() => {
    message.innerText = "";
  }, 3000);
}