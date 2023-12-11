async function addOffer() {
    const categoryName = document.getElementById("categoryName").value;
    const percentage = document.getElementById("offerPercentage").value;
    const expireDate = document.getElementById("expiryDate").value;

    if (percentage < 1 || percentage > 99) {
        alert("Offer percentage must be between 1 and 99.");
        return;
    }

    const currentDate = new Date();
    const selectedDate = new Date(expireDate);

    if (selectedDate < currentDate) {
        alert("Expiry date should be greater than the current date.");
        return;
    }

    const isCategoryExists = await checkCategoryExists(categoryName);

    if (!isCategoryExists) {
        alert("Category does not exist. Please enter a valid category name.");
        return;
    }

    const isOfferExists = await checkOfferExists(categoryName);

    if (isOfferExists) {
        alert("An offer for this category already exists. Please edit the existing offer.");
        return;
    }

    const data = {
        categoryName,
        percentage,
        expireDate,
    };

    try {
        const response = await fetch("/admin/addOffer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const responseData = await response.json();
        console.log("Success:", responseData);
        location.reload();
    } catch (error) {
        console.error("Error:", error);
    }

    $("#exampleModal").modal("hide");
}



  async function checkCategoryExists(categoryName) {
    const response = await fetch(`/admin/checkCategoryExists/${categoryName}`);
    const data = await response.json();
    return data.exists;
  }


 async function checkOfferExists(categoryName) {
    const response = await fetch(`/admin/checkOfferExists/${categoryName}`);
    const data = await response.json();
    return data.exists;
  }


  function deleteOffer(offerId) {
    fetch(`/admin/deleteOffer/${offerId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }


async function editOffer(offerid){
  const categoryName = document.getElementById("categoryName"+offerid).value;
  const percentage = document.getElementById("offerPercentage"+offerid).value;
  const expireDate = document.getElementById("expiryDate"+offerid).value;

  if (percentage < 1 || percentage > 99) {
      alert("Offer percentage must be between 1 and 99.");
      return;
  }

  const currentDate = new Date();
  const selectedDate = new Date(expireDate);

  if (selectedDate < currentDate) {
      alert("Expiry date should be greater than the current date.");
      return;
  }





  const data = {
      percentage,
      expireDate,
  };

  try {
      const response = await fetch(`/admin/editOffer/${offerid}`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log("Success:", responseData);
      location.reload();
  } catch (error) {
      console.error("Error:", error);
  }

  $("#exampleModal").modal("hide");

}