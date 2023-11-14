
function validateUserName() {
  var usernamePattern = /^[a-zA-Z0-9_.\s]{3,16}$/;
  var name = document.getElementById("name").value;
  var msg = document.getElementById("nameError");
  var signupButton = document.getElementById("signupButton");

  if (usernamePattern.test(name) && name.trim().length > 3) {
    msg.innerHTML = "";
    signupButton.disabled = false; // Enable the button
  } else {
    msg.innerHTML = "Username must be 3-20 characters";
    signupButton.disabled = true; // Disable the button
  }
}
function validateUserEmail() {
  var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  var email = document.getElementById("email").value;
  var isValid = emailPattern.test(email);
  var msg = document.getElementById("emailError");
  var signupButton = document.getElementById("signupButton");

  if (isValid) {
    msg.innerHTML = "";
    signupButton.disabled = false; // Enable the button
  } else {
    msg.innerHTML = "Invalid email address";
    signupButton.disabled = true; // Disable the button
  }
}
function validatePassword() {
  var passwordPattern = /^.{8,}$/;
  var msg = document.getElementById("passwordError");
  var password = document.getElementById("password").value;
  var isValid = passwordPattern.test(password);
  var signupButton = document.getElementById("signupButton");

  if (isValid && password.trim().length >= 8) {
    msg.innerHTML = "";
    signupButton.disabled = false; // Enable the button
  } else {
    msg.innerHTML = "Password must be at least 8 characters";
    signupButton.disabled = true; // Disable the button
  }
}

// JavaScript function to check password match
function checkPasswordMatch() {
  var password = document.getElementById("password").value;
  var confirmPassword = document.getElementById("confirm-password").value;
  var message = document.getElementById("confirmError");
  // var messagep = document.getElementById("messagep");
  var signupButton = document.getElementById("signupButton");

  if (password === confirmPassword) {
    message.innerHTML = ""; // Clear the error message
    signupButton.disabled = false; // Enable the button
  } else {
    message.innerHTML = "Passwords do not match. Please try again.";
    signupButton.disabled = true; // Disable the button
  }
}

var error = document.getElementById("err");
function hideError() {
  if (error) {
    error.style.display = "none";
  }
}
setTimeout(hideError, 3000);

const togglePassword = document.getElementById("eye");
const password = document.getElementById("password");

togglePassword.addEventListener("click", function () {
  // toggle the type attribute
  if (password.type == "password") {
    password.type = "text";
    togglePassword.classList.remove("fa-eye");
    togglePassword.classList.add("fa-eye-slash");
  } else {
    password.type = "password";
    togglePassword.classList.remove("fa-eye-slash");
    togglePassword.classList.add("fa-eye");
  }
});
