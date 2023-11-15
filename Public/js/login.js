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

//validate form
function validateForm() {
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  var emailError = document.getElementById('emailError');
  var passwordError = document.getElementById('passwordError');

  // Reset previous errors
  // nameError.innerHTML = "";
  emailError.innerHTML = "";
  passwordError.innerHTML = "";


  // Validate Email
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    emailError.innerHTML = "Enter a valid email address";
    return false; // Prevent form submission
  }

  // Validate Password
  if (password.trim() === "") {
    passwordError.innerHTML = "Password must not be empty or contain only spaces";
    return false; // Prevent form submission
  }

  return true; // Allow form submission
}


var error = document.getElementById("err");
function hideError() {
    if (error) {
      error.style.display = "none";
    }
  }
setTimeout(hideError, 5000);