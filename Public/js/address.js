$("#add-address-form").submit((e) => {
    e.preventDefault();
    console.log("clicked");
    $.ajax({
        url:"/addAddress",
        method:"POST",
        data:$('#add-address-form').serialize(),
        success:(response)=>{
            if(response.success){
                window.location.reload()
            }else{
                
            }
        }
    })
});


$(".edit-address-form").submit((e) => {
    e.preventDefault();

    // Get the address ID associated with the form
    const addressId = $(e.target).data("address-id");

    console.log("Edit clicked for address ID:", addressId);

    $.ajax({
        url: "/edit-Address",
        method: "POST",
        data: $(e.target).serialize(),
        success: (response) => {
            if (response.success) {
                console.log("Success");
                window.location.reload();
            } else {
                console.log("Error");
            }
        }
    });
});


function deleteAdrress(addressId){
    $.ajax({
        url: "/delete-address",
        method: "POST",
        data: {
            addressId:addressId
        },
        success: (response) => {
            if (response.success) {
                console.log("Success");
                window.location.reload();
            } else {
                console.log("Error");
            }
        }
    });
}