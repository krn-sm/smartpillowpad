const login = () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    document.getElementById("error-message").innerText =
      "Please fill in all fields.";
    return;
  }

  window.auth
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      window.location.href = "home.html"; // Redirect to home page immediately
    })
    .catch((error) => {
      document.getElementById("error-message").innerText = error.message;
    });
};

const signup = () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    document.getElementById("error-message").innerText =
      "Please fill in all fields.";
    return;
  }

  window.auth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      document.getElementById("error-message").innerText =
        "Signup successful! You can now log in.";
    })
    .catch((error) => {
      document.getElementById("error-message").innerText = error.message;
    });
};
