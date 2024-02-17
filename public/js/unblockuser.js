function blockUser(userId){
    Swal.fire({
        title: "Are you sure?",
        text: "they not show the main page",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, block it!"
    }).then((result) => {
        if (result.isConfirmed) {
            // Send delete request using Axios
            console.log(userId);
            axios.patch(`/admin/user/${userId}`)
            .then(response => {
                // Check if deletion was successful
                if (response.status === 200) {
                    // If successful, remove the category row from the UI
                    const rowToRemove = document.getElementById(`userRow_${userId}`);
                    if (rowToRemove) {
                        rowToRemove.remove();
                    }
                    // Show success message using SweetAlert
                    Swal.fire({
                        title: "Blocked!",
                        text: "User Blocked successfully.",
                        icon: "success"
                    });
                } else {
                    // If deletion failed, show error message using SweetAlert
                    Swal.fire({
                        title: "Error!",
                        text: "Failed to block user. Please try again later.",
                        icon: "error"
                    });
                }
            })
            .catch(error => {
                // If an error occurred during the request, show error message using SweetAlert
                
                Swal.fire({
                    title: "Error!",
                    text: "An error occurred while processing your request. Please try again later.",
                    icon: "error"
                });
            });
    }
});
}