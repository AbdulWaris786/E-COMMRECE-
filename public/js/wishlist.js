
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