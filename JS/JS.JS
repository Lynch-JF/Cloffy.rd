// Función para buscar productos
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const productName = card.getAttribute('data-name').toLowerCase();
        if (productName.includes(searchTerm)) {
            card.style.display = 'block'; // Muestra el producto si coincide
        } else {
            card.style.display = 'none'; // Oculta el producto si no coincide
        }
    });
}

// Función para mostrar/ocultar el carrito
function toggleCart() {
    const cartDisplay = document.getElementById('cartDisplay');
    cartDisplay.style.display = cartDisplay.style.display === 'block' ? 'none' : 'block';
}

// Función para agregar productos al carrito
function addToCart(productName) {
    const cartItems = document.getElementById('cartItems');
    const li = document.createElement('li');
    li.textContent = productName;
    cartItems.appendChild(li);
}

// Función para vaciar el carrito
function clearCart() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
}

// Función para ver más detalles del producto
function viewMore(productName) {
    alert(`Has seleccionado ver más sobre: ${productName}`);
}