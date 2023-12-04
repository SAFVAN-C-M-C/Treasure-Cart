$("#couponForm").submit((e) => {
    console.log("clicked");
      e.preventDefault();
      $.ajax({
        url: "/admin/addCoupon",
        method: "POST",
        data: $("#couponForm").serialize(),
        
        success: (response) => {
          if (response.success) {
            console.log(response);
            console.log("coupon added successfully");
            window.location.reload();
            $("#addCouponModal").modal("hide");
            alert("coupon Added successfully");
          } else {
            console.log(response.error);
            alert(response.error+"Try changing the Coupon code")
          }
        },
        error: (xhr, status, error) => {
          console.log("Error:", error);
          $("#flashMessage")
            .text("An error occurred. Please try again.")
            .show();
        },
      });
    });
document.addEventListener('DOMContentLoaded', function () {
    if ($('.percentageRadio').is(':checked')) {
        $('.percentageFields').show();
        $('.fixedFields').hide();
    } else if ($('.fixedRadio').is(':checked')) {
        $('.percentageFields').hide();
        $('.fixedFields').show();
    }
    generateCoupon();
});

$(document).ready(function () {
    $('input[name="discountType"]').change(function () {
        if ($('#percentageRadio').is(':checked')) {
            $('#percentageFields').show();
            $('#fixedFields').hide();
        } else if ($('#fixedRadio').is(':checked')) {
            $('#percentageFields').hide();
            $('#fixedFields').show();
        }
    });
});

$(document).ready(function () {
    $('input[name="discountTypeedit"]').change(function () {
        if ($('.percentageRadio').is(':checked')) {
            $('.percentageFields').show();
            $('.fixedFields').hide();
        } else if ($('.fixedRadio').is(':checked')) {
            $('.percentageFields').hide();
            $('.fixedFields').show();
        }
    });
});


//add coupon



function deleteCoupon(couponId) {
    $.ajax({
        url: "/admin/deleteCoupon/" + couponId,
        method: "DELETE",
        success: function (response) {
            if (response.success) {
                console.log("Coupon deleted successfully");
                location.reload();
            } else {
                console.log("Error deleting coupon: " + response.error);
            }
        },
        error: function (xhr, status, error) {
            console.log("Error:", error);
        }
    });
}

function generateCoupon() {
    // Generate a random alphanumeric code
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomCode = '';

    for (let i = 0; i < 12; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomCode += characters.charAt(randomIndex);
    }

    // Display the generated code in the input field
    document.getElementById('couponCode').value = randomCode;
}
