
// Function to add item to cart

async function addToCart(productId) {
    const data = {
        productId: productId,
        quantity: 1 // Or any desired quantity
    };
    try {
        const response = await axios.post('/addToCart/add', data);
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
        const cartDetails = response.data.cart 
        
        // Update the cart length on all pages  
        updateCartLength(itemsLength);
        gotocart(cartDetails)
    } catch (error) {
        console.error("Error fetching cart length:", error);
    }
}

// Function to update the cart length on all pages
function gotocart(cart) {
    cart.items.forEach(id=>{
        const a= document.querySelector(`.goto${id.productId}`); 
      a.innerText='Go To Cart'
    })
}
function updateCartLength(length) {
    const cartLengthElements = document.querySelectorAll('.cart-length');
    cartLengthElements.forEach(element => {
        element.textContent = length;
    });
}

// Call fetchCartLength when the DOM content is loaded
document.addEventListener('DOMContentLoaded', async () => {
  const abc=  await fetchCartLength(); 
    
});
document.addEventListener('DOMContentLoaded', async () => {
    const efg = await gotocart() 
     
});
function removeCart(cartId){
    axios.delete(`/addToCartDlt/${cartId}`)
    .then(responce =>{
        if(responce.status === 200){
            const rowToRemove = document.getElementById(`cartRow_${cartId}`);
            if(rowToRemove){
                rowToRemove.remove()
            }else{
                window.alert("its not remove the cart")
            }
        }
    })
    .catch(error =>{
        console.error(error);
    })
}

function plus(itemId,price){

    const qty = document.querySelector(".counderDisplay[data-item-id='" + itemId + "']");
    qty.innerText = +qty.innerText + 1;
    const quantity = parseInt(qty.innerText)
    updateQuantity(itemId, quantity);
    const updatePrice =document.querySelector(`.updatePrice${itemId}`)
    updatePrice.innerText =+price*quantity
}
function minus(itemId,price){

    const qty = document.querySelector(".counderDisplay[data-item-id='" + itemId + "']");
        if(qty.innerText > 1){
            let quantity = parseInt(qty.innerText);
            quantity--; 
            qty.innerText = quantity; 
        updateQuantity(itemId, quantity);
        const updatePrice =document.querySelector(`.updatePrice${itemId}`)
        updatePrice.innerText =+price*quantity
    }
}
async function updateQuantity(itemId, operation) {
    try {
        const responce =await axios.post("updateCart",{
            productId:itemId,
            qty:operation
        })
    } catch (error) {
        console.log(error);
    }
}


