// Datos de productos
const productos = [
    {
        id: 1,
        nombre: "Café Capuccino",
        descripcion: "Un café suave que genera espuma",
        precio: 15.00,
        imagen: "../Imagenes/bolsadecafe1.PNG"
    },
    {
        id: 2,
        nombre: "Café Americano",
        descripcion: "Café negro con un toque gringo",
        precio: 18.00,
        imagen: "../Imagenes/bolsadecafe1.PNG"
    },
    {
        id: 3,
        nombre: "Café Espresso",
        descripcion: "Intenso y concentrado",
        precio: 19.00,
        imagen: "../Imagenes/bolsadecafe1.PNG"
    },
    {
        id: 4,
        nombre: "Café Latte",
        descripcion: "Listo para mezclar con tu leche favorita",
        precio: 15.00,
        imagen: "../Imagenes/bolsadecafe1.PNG"
    },
    {
        id: 5,
        nombre: "Moccacino",
        descripcion: "Una deliciosa combinación de café y chocolate",
        precio: 12.00,
        imagen: "../Imagenes/bolsadecafe1.PNG"
    }
];

// Estado del carrito
let carrito = [];
let carritoVisible = false;

// Elementos del DOM
const productosContainer = document.getElementById('productos-container');
const floatingCart = document.getElementById('floating-cart');
const cartItems = document.getElementById('cart-items');
const totalAmount = document.getElementById('total-amount');
const cartIcon = document.querySelector('.cart-icon');
const cartCount = document.querySelector('.cart-count');

// Inicializar la tienda
document.addEventListener('DOMContentLoaded', function() {
    renderProductos();
    setupEventListeners();
    animateOnScroll();
});

// Renderizar productos
function renderProductos() {
    productosContainer.innerHTML = '';
    
    productos.forEach((producto, index) => {
        const productCard = `
            <div class="col-lg-4 col-md-6">
                <div class="product-card animate-on-scroll" data-delay="${(index + 1) * 0.1}s">
                    <div class="product-image">
                        <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid">
                        <div class="product-name-overlay">${producto.nombre}</div>
                        <div class="product-overlay">
                            <button class="btn btn-quick-view" onclick="quickView(${producto.id})">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                    <div class="product-info">
                        <h4>${producto.nombre}</h4>
                        <p class="product-description">${producto.descripcion}</p>
                        <div class="product-price">S/${producto.precio.toFixed(2)}</div>
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="decreaseQuantity(${producto.id})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" id="qty-${producto.id}" value="0" min="0" readonly class="quantity-input">
                            <button class="quantity-btn" onclick="increaseQuantity(${producto.id})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button class="add-to-cart-btn" onclick="addToCart(${producto.id})">
                            <i class="fas fa-shopping-cart me-2"></i>Agregar al Carrito
                        </button>
                    </div>
                </div>
            </div>
        `;
        productosContainer.innerHTML += productCard;
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Carrito flotante
    cartIcon.addEventListener('click', toggleCart);
    
    // Cerrar carrito
    document.querySelector('.btn-close-cart').addEventListener('click', closeCart);
    
    // Checkout
    document.querySelector('.checkout-btn').addEventListener('click', checkout);
    
    // Cerrar carrito al hacer click fuera
    document.addEventListener('click', function(e) {
        if (!floatingCart.contains(e.target) && !cartIcon.contains(e.target)) {
            closeCart();
        }
    });
}

// Aumentar cantidad
function increaseQuantity(productId) {
    const qtyInput = document.getElementById(`qty-${productId}`);
    let currentQty = parseInt(qtyInput.value);
    qtyInput.value = currentQty + 1;
    
    // Efecto visual
    qtyInput.style.transform = 'scale(1.2)';
    setTimeout(() => {
        qtyInput.style.transform = 'scale(1)';
    }, 200);
}

// Disminuir cantidad
function decreaseQuantity(productId) {
    const qtyInput = document.getElementById(`qty-${productId}`);
    let currentQty = parseInt(qtyInput.value);
    if (currentQty > 0) {
        qtyInput.value = currentQty - 1;
        
        // Efecto visual
        qtyInput.style.transform = 'scale(0.8)';
        setTimeout(() => {
            qtyInput.style.transform = 'scale(1)';
        }, 200);
    }
}

// Agregar al carrito
function addToCart(productId) {
    const qtyInput = document.getElementById(`qty-${productId}`);
    const quantity = parseInt(qtyInput.value);
    
    if (quantity === 0) {
        showNotification('Por favor selecciona una cantidad', 'warning');
        return;
    }
    
    const producto = productos.find(p => p.id === productId);
    const existingItem = carrito.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        carrito.push({
            ...producto,
            quantity: quantity
        });
    }
    
    // Resetear cantidad
    qtyInput.value = 0;
    
    updateCartUI();
    showNotification(`${producto.nombre} agregado al carrito`, 'success');
    
    // Efecto visual en el botón
    const btn = event.target.closest('.btn-add-cart');
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 150);
}

// Actualizar UI del carrito
function updateCartUI() {
    // Actualizar contador
    const totalItems = carrito.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'block' : 'none';
    
    // Actualizar contenido del carrito
    if (carrito.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
        document.querySelector('.checkout-btn').disabled = true;
        document.querySelector('.checkout-btn').style.opacity = '0.5';
    } else {
        let cartHTML = '';
        carrito.forEach(item => {
            cartHTML += `
                <div class="cart-item">
                    <img src="${item.imagen}" alt="${item.nombre}" class="cart-item-image">
                    <div class="cart-item-info">
                        <h6>${item.nombre}</h6>
                        <div class="cart-item-controls">
                            <button class="btn-cart-qty" onclick="updateCartQuantity(${item.id}, -1)">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="cart-qty">${item.quantity}</span>
                            <button class="btn-cart-qty" onclick="updateCartQuantity(${item.id}, 1)">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <div class="cart-item-price">S/${(item.precio * item.quantity).toFixed(2)}</div>
                    </div>
                    <button class="btn-remove-item" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });
        cartItems.innerHTML = cartHTML;
        document.querySelector('.checkout-btn').disabled = false;
        document.querySelector('.checkout-btn').style.opacity = '1';
    }
    
    // Actualizar total
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
    totalAmount.textContent = total.toFixed(2);
}

// Actualizar cantidad en carrito
function updateCartQuantity(productId, change) {
    const item = carrito.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
}

// Remover del carrito
function removeFromCart(productId) {
    carrito = carrito.filter(item => item.id !== productId);
    updateCartUI();
    showNotification('Producto removido del carrito', 'info');
}

// Toggle carrito
function toggleCart() {
    if (carritoVisible) {
        closeCart();
    } else {
        openCart();
    }
}

// Abrir carrito
function openCart() {
    floatingCart.classList.add('show');
    carritoVisible = true;
    document.body.style.overflow = 'hidden';
}

// Cerrar carrito
function closeCart() {
    floatingCart.classList.remove('show');
    carritoVisible = false;
    document.body.style.overflow = 'auto';
}

// Checkout
function checkout() {
    if (carrito.length === 0) {
        showNotification('Tu carrito está vacío', 'warning');
        return;
    }
    
    // Simular proceso de checkout
    showNotification('Redirigiendo al proceso de pago...', 'info');
    
    setTimeout(() => {
        // Aquí iría la integración con el sistema de pagos
        window.open('https://imgur.com/a/tMqMJPh', '_blank');
    }, 1500);
}

// Vista rápida
function quickView(productId) {
    const producto = productos.find(p => p.id === productId);
    // Implementar modal de vista rápida
    showNotification(`Vista rápida de ${producto.nombre}`, 'info');
}

// Mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'warning': return 'exclamation-triangle';
        case 'error': return 'times-circle';
        default: return 'info-circle';
    }
}

// Animaciones al hacer scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, parseFloat(delay) * 1000);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}