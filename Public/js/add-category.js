function validateName() {
    var Pattern = /^[a-zA-Z0-9_.,\s]$/;
    var name = document.getElementById("Category_name").value;
    var msg = document.getElementById("nameError");
    var signupButton = document.getElementById("signupButton");
  
    if (Pattern.test(name) && name.trim().length >=3) {
        msg.innerHTML = "";
        signupButton.disabled = false; // Enable the button
    } else {
        msg.innerHTML = "category name must be more than 3 characters";
        signupButton.disabled = true; // Disable the button
    }
}
function validatebrand() {
    var Pattern = /^[a-zA-Z0-9_.\s]{3,}$/;
    var name = document.getElementById("Brand_name").value;
    var msg = document.getElementById("nameError");
    var signupButton = document.getElementById("signupButton");
  
    if (Pattern.test(name) && name.trim().length >=3) {
        msg.innerHTML = "";
        signupButton.disabled = false; // Enable the button
    } else {
        msg.innerHTML = "brand name must be more than 3 characters";
        signupButton.disabled = true; // Disable the button
    }
}