var error = document.getElementById("err");
function hideError() {
    if (error) {
      error.style.display = "none";
    }
  }
setTimeout(hideError, 3000);

//vlaidate form
function validateForm() {
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var confirm = document.getElementById('confirm-password').value;
    var nameError = document.getElementById('nameError');
    var emailError = document.getElementById('emailError');
    var passwordError = document.getElementById('passwordError');
    var confirmError = document.getElementById('confirmError');


    // Reset previous errors
    nameError.innerHTML = "";
    emailError.innerHTML = "";
    passwordError.innerHTML = "";
    confirmError.innerHTML = "";

    // Validate Name
    if (name.trim() === "") {
      nameError.innerHTML = "Name must not be empty or contain only spaces";
      return false; // Prevent form submission
    }

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
    if(password!==confirm){
      confirmError.innerHTML = "Password doesn't match!"
      return false
    }


    return true; // Allow form submission
  }


  //eye
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