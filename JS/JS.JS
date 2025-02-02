// Variables para el carrito
let cart = JSON.parse(localStorage.getItem('cart')) || []; // Recuperar el carrito del localStorage
let totalAmount = parseFloat(localStorage.getItem('totalAmount')) || 0; // Recuperar el total del localStorage

// Función para guardar el carrito en el localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('totalAmount', totalAmount.toFixed(2));
}

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
    // Verificar si el producto ya está en el carrito
    const existingProduct = cart.find(item => item.name === productName);

    if (existingProduct) {
        // Si el producto ya está en el carrito, aumentar la cantidad
        existingProduct.quantity += 1;
        existingProduct.totalPrice = existingProduct.quantity * existingProduct.price;
    } else {
        // Si el producto no está en el carrito, agregarlo
        cart.push({ name: productName, price: price, quantity: 1, totalPrice: price });
    }

    // Actualizar el total
    totalAmount += price;

    // Guardar el carrito en el localStorage
    saveCart();

    // Actualizar la visualización del carrito
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
        li.textContent = `${item.name} - $${item.price.toFixed(2)} x ${item.quantity} = $${item.totalPrice.toFixed(2)}`;
        cartItems.appendChild(li);
    });

    // Actualizar el total
    totalAmountElement.textContent = totalAmount.toFixed(2);
}

// Función para vaciar el carrito
function clearCart() {
    cart = [];
    totalAmount = 0;
    saveCart(); // Guardar el carrito vacío en el localStorage
    updateCartDisplay();
}

// Función para ver más detalles del producto
function viewMore(productName) {
    alert(`Has seleccionado ver más sobre: ${productName}`);
}

// Cargar el carrito al iniciar la página
window.onload = function () {
    updateCartDisplay();
};