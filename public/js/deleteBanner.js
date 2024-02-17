function deleteBanner(bannerId){
    Swal.fire({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this category!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
}).then((result) => {
    if (result.isConfirmed) {
        // Send delete request using Axios
        axios.delete(`/admin/bannerDlt/${bannerId}`)
            .then(response => {
                // Check if deletion was successful
                if (response.status === 200) {
                    // If successful, remove the category row from the UI
                    const rowToRemove = document.getElementById(`bannerRow_${bannerId}`);
                    if (rowToRemove) {
                        rowToRemove.remove();
                    }
                    // Show success message using SweetAlert
                    Swal.fire({
                        title: "Deleted!",
                        text: "banner deleted successfully.",
                        icon: "success"
                    });
                } else {
                    // If deletion failed, show error message using SweetAlert
                    Swal.fire({
                        title: "Error!",
                        text: "Failed to delete banner. Please try again later.",
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