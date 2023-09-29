// const signUpButton = document.getElementById('signUp');
// const signInButton = document.getElementById('signIn');
// const container = document.getElementById('container');

// signUpButton.addEventListener('click', () =>
//     container.classList.add('right-panel-active'));

// signInButton.addEventListener('click', () =>
//     container.classList.remove('right-panel-active'));

// // https://Github.com/YasinDehfuli
// // 	 https://Codepen.io/YasinDehfuli
// // Disigned By Nisay



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