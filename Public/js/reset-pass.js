    function validatePassword() {
        var passwordPattern = /^.{8,}$/;
        var msg = document.getElementById("passwordError");
        var password = document.getElementById("password").value;
        var isValid = passwordPattern.test(password);
        var signupButton = document.getElementById("signupButton");

        if (isValid && password.trim().length >8) {
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
        var confirmPassword = document.getElementById("confirmpass1").value;
        var message = document.getElementById("message");
        var messagep = document.getElementById("messagep");
        var signupButton = document.getElementById("signupButton");

        if (password === confirmPassword) {
            message.innerHTML = ""; // Clear the error message
            signupButton.disabled = false; // Enable the button
        } else {
            message.innerHTML = "Passwords do not match. Please try again.";
            signupButton.disabled = true; // Disable the button
        }
    }

