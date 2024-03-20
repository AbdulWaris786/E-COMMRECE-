document.getElementById('cancelCouponButton').addEventListener('click', function() {
    console.log("Your event handling code here");
    axios.post("/withoutCoupon")
    .then(function (response) {
        console.log('Response:', response.data);
        Swal.fire({
            position: "center",
            icon: "success",
            title: "CONFIRMED ORDER",
            showConfirmButton: false,
            timer: 1500
        });
        setTimeout(() => {
            window.location.href = "/";
        }, 2000);
    })
    .catch(function (error) {
            // Handle error
            console.error('Error:', error);
    });

})