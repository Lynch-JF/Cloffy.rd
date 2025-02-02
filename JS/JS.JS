// Variables para el carrito
let cart = [];
let totalAmount = 0;

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
function addToCart(productName, price) {
    cart.push({ name: productName, price: price });
    totalAmount += price;
    updateCartDisplay();
}

// Función para actualizar la visualización del carrito
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const totalAmountElement = document.getElementById('totalAmount');

    // Limpiar la lista de productos
    cartItems.innerHTML = '';

    // Agregar cada producto al carrito
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - $${item.price.toFixed(2)}`;
        cartItems.appendChild(li);
    });

    // Actualizar el total
    totalAmountElement.textContent = totalAmount.toFixed(2);
}

// Función para vaciar el carrito
function clearCart() {
    cart = [];
    totalAmount = 0;
    updateCartDisplay();
}

// Función para ver más detalles del producto
function viewMore(productName) {
    alert(`Has seleccionado ver más sobre: ${productName}`);
}