
// Function to add item to cart
async function addToCart(productId) {
    const data = {
        productId: productId,
        quantity: 1 // Or any desired quantity
    };
    try {
        const response = await axios.post('/addToCart/add', data);
        console.log(response.data); // Logging the response data for debugging
        // After adding the item to cart, fetch the updated cart length
        await fetchCartLength();
    } catch (error) {
        console.error('Error adding item to cart:', error);
    }
}

// Function to fetch the cart length from the server
async function fetchCartLength() {
    try {
        const response = await axios.get("/countCart");
        const itemsLength = response.data.itemsLength;
        // Update the cart length on all pages
        updateCartLength(itemsLength);
    } catch (error) {
        console.error("Error fetching cart length:", error);
    }
}

// Function to update the cart length on all pages
function updateCartLength(length) {
    const cartLengthElements = document.querySelectorAll('.cart-length');
    cartLengthElements.forEach(element => {
        element.textContent = length;
    });
}

// Call fetchCartLength when the DOM content is loaded
document.addEventListener('DOMContentLoaded', async () => {
  const abc=  await fetchCartLength(); 
  console.log(abc);
});


// async function addToCart(productId){
//     const data = {
//         productId:productId,
//         quantity: 1 // Or any desired quantity
//     };
//     console.log(data);
// const response = await axios.post('/addToCart/add',data)
// }