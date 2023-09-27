document.addEventListener("DOMContentLoaded", function () {
    var otpInputs = document.querySelectorAll(".otp-input");
    var emailOtpInputs = document.querySelectorAll(".email-otp-input");

    function setupOtpInputListeners(inputs) {
      inputs.forEach(function (input, index) {
        input.addEventListener("paste", function (ev) {
          var clip = ev.clipboardData.getData('text').trim();
          if (!/^\d{6}$/.test(clip)) {
            ev.preventDefault();
            return;
          }

          var characters = clip.split("");
          inputs.forEach(function (otpInput, i) {
            otpInput.value = characters[i] || "";
          });

          enableNextBox(inputs[0], 0);
          inputs[5].removeAttribute("disabled");
          inputs[5].focus();
          updateOTPValue(inputs);
        });

        input.addEventListener("input", function () {
          var currentIndex = Array.from(inputs).indexOf(this);
          var inputValue = this.value.trim();

          if (!/^\d$/.test(inputValue)) {
            this.value = "";
            return;
          }

          if (inputValue && currentIndex < 5) {
            inputs[currentIndex + 1].removeAttribute("disabled");
            inputs[currentIndex + 1].focus();
          }

          if (currentIndex === 4 && inputValue) {
            inputs[5].removeAttribute("disabled");
            inputs[5].focus();
          }

          updateOTPValue(inputs);
        });

        input.addEventListener("keydown", function (ev) {
          var currentIndex = Array.from(inputs).indexOf(this);

          if (!this.value && ev.key === "Backspace" && currentIndex > 0) {
            inputs[currentIndex - 1].focus();
          }
        });
      });
    }

    function enableNextBox(input, currentIndex) {
      var inputValue = input.value;

      if (inputValue === "") {
        return;
      }

      var nextIndex = currentIndex + 1;
      var nextBox = otpInputs[nextIndex] || emailOtpInputs[nextIndex];

      if (nextBox) {
        nextBox.removeAttribute("disabled");
      }
    }

    function updateOTPValue(inputs) {
      var otpValue = "";

      inputs.forEach(function (input) {
        otpValue += input.value;
      });

      if (inputs === otpInputs) {
        document.getElementById("verificationCode").value = otpValue;
      } else if (inputs === emailOtpInputs) {
        document.getElementById("emailverificationCode").value = otpValue;
      }
    }

    setupOtpInputListeners(otpInputs);
    setupOtpInputListeners(emailOtpInputs);

    otpInputs[0].focus(); // Set focus on the first OTP input field
    emailOtpInputs[0].focus(); // Set focus on the first email OTP input field

    otpInputs[5].addEventListener("input", function () {
      updateOTPValue(otpInputs);
    });

    emailOtpInputs[5].addEventListener("input", function () {
      updateOTPValue(emailOtpInputs);
    });
  });