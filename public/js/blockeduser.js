function unblockUser(userId) {
    Swal.fire({
        title: "Are you sure?",
        text: "they  show the main page",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, unblock it!"
    }).then((result) => {
        if (result.isConfirmed) {
            // Send delete request using Axios
            console.log(userId);
            axios.patch(`/admin/blockedUsers/${userId}`)
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
                        title: "Unblocked!",
                        text: "User Unblocked successfully.",
                        icon: "success"
                    });
                } else {
                    // If deletion failed, show error message using SweetAlert
                    Swal.fire({
                        title: "Error!",
                        text: "Failed to unblock user. Please try again later.",
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
function deleteUser(userId){
    Swal.fire({
        title: "Are you sure?",
        text: "the dosn't login this email ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            // Send delete request using Axios
            console.log(userId);
            axios.delete(`/admin/userDelete/${userId}`)
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
                        title: "Deleted!",
                        text: "User deleted  successfully.",
                        icon: "success"
                    });
                } else {
                    // If deletion failed, show error message using SweetAlert
                    Swal.fire({
                        title: "Error!",
                        text: "Failed to delete user. Please try again later.",
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