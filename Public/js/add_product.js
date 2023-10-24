
function validateName() {
    var Pattern = /^[a-zA-Z0-9_.\s]{3,16}$/;
    var name = document.getElementById("Product_Name").value;
    var msg = document.getElementById("productError");
    var signupButton = document.getElementById("signupButton");
  
    if (Pattern.test(name) && name.trim().length >=3) {
        msg.innerHTML = "";
        signupButton.disabled = false; // Enable the button
    } else {
        msg.innerHTML = "Product name must be more than 3 characters";
        signupButton.disabled = true; // Disable the button
    }
  }
  function validateDescription() {
    var Pattern = /^[a-zA-Z0-9_.\s]+$/;
    var name = document.getElementById("Description").value;
    var msg = document.getElementById("descriptionError");
    var signupButton = document.getElementById("signupButton");
  
    if (Pattern.test(name) && name.trim().length >=3) {
        msg.innerHTML = "";
        signupButton.disabled = false; // Enable the button
    } else {
        msg.innerHTML = "description name must be more than 3 characters";
        signupButton.disabled = true; // Disable the button
    }
  }

  function validateDescription() {
    var Pattern = /^[a-zA-Z0-9_.\s]+$/;
    var name = document.getElementById("Description").value;
    var msg = document.getElementById("descriptionError");
    var signupButton = document.getElementById("signupButton");
  
    if (Pattern.test(name) && name.trim().length >3) {
        msg.innerHTML = "";
        signupButton.disabled = false; // Enable the button
    } else {
        msg.innerHTML = "description name must be more than 3 characters";
        signupButton.disabled = true; // Disable the button
    }
  }
  function validateStock() {
    // var Pattern = /[0-9]/;
    var value = document.getElementById("stock").value;
    var msg = document.getElementById("stockError");
    var signupButton = document.getElementById("signupButton");
  
    if ( value>0) {
        msg.innerHTML = "";
        signupButton.disabled = false; // Enable the button
    } else {
        msg.innerHTML = "Enter some stock";
        signupButton.disabled = true; // Disable the button
    }
  }
  function validatbase() {
    // var Pattern = /[0-9]/;
    var value = document.getElementById("basePrice").value;
    var msg = document.getElementById("baseError");
    var signupButton = document.getElementById("signupButton");
  
    if ( value >0) {
        msg.innerHTML = "";
        signupButton.disabled = false; // Enable the button
    } else {
        msg.innerHTML = "Enter some price";
        signupButton.disabled = true; // Disable the button
    }
  }
  function validatprice() {
    // var Pattern = /[0-9]/;
    var value = document.getElementById("descountedPrice").value;
    var msg = document.getElementById("priceError");
    var signupButton = document.getElementById("signupButton");
  
    if ( value >0) {
        msg.innerHTML = "";
        signupButton.disabled = false; // Enable the button
    } else {
        msg.innerHTML = "Enter some price";
        signupButton.disabled = true; // Disable the button
    }
  }
  function validateBrand() {
    var selectedValue = document.getElementById("brand").value;
    var msg = document.getElementById("brandError");
    var signupButton = document.getElementById("signupButton");
  
    if (selectedValue !== "default") {
        // Valid selection
        msg.innerHTML = "";
        signupButton.disabled = false; // Enable the button
    } else {
        // Invalid or default selection
        msg.innerHTML = "Select a brand";
        signupButton.disabled = true; // Disable the button
    }
}
  function validcategory() {
    var selectedValue = document.getElementById("category").value;
    var msg = document.getElementById("categoryError");
    var signupButton = document.getElementById("signupButton");
  
    if (selectedValue !== "default") {
        // Valid selection
        msg.innerHTML = "";
        signupButton.disabled = false; // Enable the button
    } else {
        // Invalid or default selection
        msg.innerHTML = "Select a category";
        signupButton.disabled = true; // Disable the button
    }
  }



  
  