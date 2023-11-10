function addtoCart(productId) {
    var element = document.getElementById("toastCart");
    var option = {
      animation: true,
      delay: 2000,
      autohide: true
    }
    var toastElement = new bootstrap.Toast(element, option)

    console.log("hello");

    $.ajax({
      url: '/addtoCart',
      method: 'POST',
      data: {
        productId: productId,
      },
      success: function (response) {
        // alert("product added to the cart")
        // window.location.reload();
        console.log(response);

        toastElement.show()
      },
      error: function (error) {
        console.error('Error while product added to the cart:', error);
      }
    });

  }
  function showalert() {
    var element = document.getElementById("alertstock");
    var option = {
      animation: true,
      delay: 2000,
      autohide: true
    }
    var toastElement = new bootstrap.Toast(element, option)
    toastElement.show()
  }
  document.querySelectorAll('.add-to-wishlist-button').forEach(button => {
    button.addEventListener('click', function (event) {
      event.preventDefault();


      const productId = this.getAttribute('data-product-id');
      const icon = this.querySelector('.fa-heart');

      $.ajax({
        url: '/wishlist/',
        method: 'POST',
        data: {
          productId: productId,
        },
        success: function (response) {
          console.log(icon.style.color)
          if (response.added) {
            icon.classList.add('text-danger')

          } else {
            icon.classList.remove('text-danger')
          }
        },
        error: function (error) {
          console.error('Error updating wishlist:', error);
        }
      });
    });
  });