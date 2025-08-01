// Animaciones al hacer scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, delay * 1000);
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

// Efecto de navbar al hacer scroll
function handleNavbarScroll() {
    const navbar = document.querySelector('.custom-navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Manejo del formulario de contacto
function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = form.querySelector('.custom-btn');
    const successMessage = document.getElementById('success-message');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Mostrar estado de carga
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Simular envío (en un caso real, aquí iría la lógica de envío)
        setTimeout(() => {
            // Ocultar formulario y mostrar mensaje de éxito
            form.style.display = 'none';
            successMessage.classList.add('show');
            
            // Resetear botón
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            
            // Opcional: resetear formulario después de un tiempo
            setTimeout(() => {
                form.reset();
                form.style.display = 'block';
                successMessage.classList.remove('show');
            }, 5000);
        }, 2000);
    });
}

// Validación en tiempo real
function initFormValidation() {
    const inputs = document.querySelectorAll('.form-control');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Validación básica
    if (field.hasAttribute('required') && !value) {
        isValid = false;
    }
    
    // Validación de email
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
    }
    
    // Aplicar clases de validación
    if (isValid) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    } else {
        field.classList.remove('is-valid');
        field.classList.add('is-valid');
    }
    
    return isValid;
}

// Smooth scrolling para enlaces internos
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Inicializar todas las funciones
document.addEventListener('DOMContentLoaded', function() {
    animateOnScroll();
    handleNavbarScroll();
    initContactForm();
    initFormValidation();
    initSmoothScrolling();
    
    // Añadir clase de carga completada
    document.body.classList.add('loaded');
});

// Preloader simple
window.addEventListener('load', function() {
    document.body.classList.add('page-loaded');
});