

let selectedAddress ;
document.getElementById("saveButton").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent form submission
    
    // Get all radio buttons with the name "selected-address"
    var radioButtons = document.querySelectorAll('input[name="selected-address"]');
     selectedAddress = null;

    // Loop through each radio button to find the selected one
    for (var i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            var selectedIndex = parseInt(radioButtons[i].value); // Get the index of the selected address
            var selectedRow = radioButtons[i].closest('tr'); // Find the parent row of the selected radio button
            var fullName = selectedRow.cells[1].textContent; // Get the full name from the second cell
            var address = selectedRow.cells[2].textContent; // Get the address from the third cell
            var pinCode = selectedRow.cells[3].textContent; // Get the pin code from the fourth cell
            var phoneNumber = selectedRow.cells[4].textContent; // Get the phone number from the fifth cell

            // Create the selected address object
            selectedAddress = {
                fullName: fullName,
                address: address,
                pinCode: pinCode,
                phoneNumber: phoneNumber
            };
            break; // Exit the loop once the selected address is found
        }
    }

    if (selectedAddress) {
        console.log("Selected address:", selectedAddress);
        // Now you have the selected address object, you can use it as needed
    } else {
        console.log("No address selected");
    }
});

document.getElementById("palceOrder").addEventListener("click",async function  (event){
    event.preventDefault();
    console.log("ji")
    if (selectedAddress) {
        console.log("Placing order with selected address:", selectedAddress);
        var paymentRadioButtons = document.getElementsByName("payment");
        const grandTotal = document.getElementById("grandTotal")
    // Loop through each radio button to find the selected one
    for (var i = 0; i < paymentRadioButtons.length; i++) {
        if (paymentRadioButtons[i].checked) {
            var payment = paymentRadioButtons[i].value; // Get the value of the selected payment method
            console.log("Selected payment method:", payment);
            // Now you have the selected payment method, you can use it as needed
            break; // Exit the loop once the selected payment method is found
        }
    }
        // Perform actions to place the order using the selected address
        try {
            const response = await axios.post(`/checkout/${grandTotal.textContent}`, {selectedAddress,payment});
            
            console.log("Order placed successfully:", response.data);
           
            const id = response.data.coupon[0]._id;
            console.log(id);
            // Construct the URL with the id as a query parameter
            const urlWithQuery = response.data.url + "?id=" + id;
            // Redirect the user to the constructed URL
            window.location.href = urlWithQuery;
            
        } catch (error) {
            console.log("Error placing order:", error);
            // Handle error
        }

    } else {
        Swal.fire("please save the address");
        console.log("No address selected to place order");
    }
});

