const searchButton = document.getElementById('searchButton');
const searchResults = document.getElementById('searchResults');
searchButton.addEventListener('click', performSearch);
const searchInput = document.getElementById('main-search');
console.log(searchInput.value,searchInput.textContent,'nithin1');
searchInput.addEventListener('keydown', function(event) {
    if (event.key === "Enter") {
        event.preventDefault()
    const searchInput = document.getElementById('main-search');
    
console.log(searchInput.value,searchInput.textContent,'nithin2');
        performSearch();
    }
});

async function performSearch() {
    const searchTerm = searchInput.value.trim();
    
console.log(searchInput.value,searchInput.textContent,'nithin3');
    try {
        const url = `/search/?q=${searchTerm}`;
        console.log("nithin", searchTerm, url);
        window.location.href = url;
    } catch (error) {
        console.error('Error:', error);
    }
}
