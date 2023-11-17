function addtoCart(productId) {
    var element=document.getElementById("toastCart");
    var option={
      animation:true,
      delay:2000,
      autohide: true
    }
    var toastElement=new bootstrap.Toast(element, option)
    
console.log("hello");

$.ajax({
  url: '/addtoCart',
  method: 'POST',
  data: {
    productId: productId,
  },
  success: function (response) {
    // alert("product added to the cart")
    
    console.log(response);

    toastElement.show()
    $("#cartCount").text('('+parseFloat(response.cartCount)+')');
    
  },
  error: function (error) {
    console.error('Error while product added to the cart:', error);
  }
});

}
function showalert(){
var element=document.getElementById("alertstock");
    var option={
      animation:true,
      delay:2000,
      autohide: true
    }
    var toastElement=new bootstrap.Toast(element, option)
    toastElement.show()
}
document.querySelectorAll('.add-to-wishlist-button').forEach(button => {
  button.addEventListener('click', function (event) {
      event.preventDefault();
      console.log("clickdd");

      const productId = this.getAttribute('data-product-id');
      console.log(productId);
      const icon = this.querySelector('.fa-heart');
      var label = this.querySelector('.lablewish');
      console.log("label",label);


      $.ajax({
          url: '/wishlist',
          method: 'POST',
          data: {
              productId: productId,
          },
          success: function (response) {
              console.log(icon.style.color)
              if (response.added) {
                  icon.classList.add('text-danger')
                  label.innerHTML="Saved to wishlist";
                
              } else {
                  icon.classList.remove('text-danger')
                  label.innerHTML="Save to wishlist";
              }
          },
          error: function (error) {
              console.error('Error updating wishlist:', error);
          }
      });
  });
});
function showwarning() {
  console.log("clicked");
  var element=document.getElementById("alertlog");
    var option={
      animation:true,
      delay:5000,
      autohide: true
    }
    var toastElement=new bootstrap.Toast(element, option)
    toastElement.show()
}