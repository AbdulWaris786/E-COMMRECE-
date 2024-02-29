const { response } = require("express");

async function wishlist(productId,userId){
    if (!userId || !productId) {
        console.log("User ID or Product ID is missing");
        return; // You can handle this case as per your requirement
    }
    try {
        const response = await axios.post('/wishlist/add', { userId, productId });
        console.log(response.data);
    } catch (error) {
        console.error('error adding item to wishlist',error)
    }
}

function removeWL(itemId){
    axios.delete(`/wishlistDlt/${itemId}`)
    .then(response=>{
        if(response.status ===200){
            const rowToRemove =document.getElementById(`wishlistRow_${itemId}`)
            if(rowToRemove){
                rowToRemove.remove()
            }else{
                window.alert("its not remove that wishlist")
            }
        }
    })
    .catch(error =>{
        console.error(error);
    })

}