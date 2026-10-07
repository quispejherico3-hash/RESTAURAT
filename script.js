document.addEventListener('DOMContentLoaded', () => {
    // 1. Menú Responsive (Hamburguesa)
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });

    // 2. Filtros de Categoría del Menú
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.filter-btn.active').classList.remove('active');
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            menuItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    item.classList.remove('hidden-item');
                } else {
                    item.classList.add('hidden-item');
                }
            });
        });
    });

    // 3. Botón Volver Arriba
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 4. Carrito de Pedidos Interactivos y Envío al Mesero
    let cart = [];

    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const sendOrderBtn = document.getElementById('sendOrderBtn');
    const tableNumberInput = document.getElementById('tableNumber');

    cartBtn.addEventListener('click', () => cartModal.classList.remove('hidden'));
    closeCart.addEventListener('click', () => cartModal.classList.add('hidden'));

    document.querySelectorAll('.btn-add').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemCard = e.target.closest('.menu-item');
            const name = itemCard.getAttribute('data-name');
            const price = parseFloat(itemCard.getAttribute('data-price'));

            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ name, price, quantity: 1 });
            }

            updateCartUI();
            
            cartCount.style.transform = 'scale(1.3)';
            setTimeout(() => { cartCount.style.transform = 'scale(1)'; }, 200);
        });
    });

    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Tu pedido está vacío actualmente.</p>';
            sendOrderBtn.disabled = true;
            cartTotal.textContent = '$0.00';
            cartCount.textContent = '0';
            return;
        }

        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            totalItems += item.quantity;

            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name} (x${item.quantity})</h4>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <button class="remove-item" onclick="removeFromCart(${index})" aria-label="Eliminar producto"><i class="fas fa-trash"></i></button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        cartTotal.textContent = `$${total.toFixed(2)}`;
        cartCount.textContent = totalItems;
        validateOrderButton();
    }

    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        updateCartUI();
    }

    tableNumberInput.addEventListener('input', validateOrderButton);

    function validateOrderButton() {
        if (cart.length > 0 && tableNumberInput.value.trim() !== '') {
            sendOrderBtn.disabled = false;
        } else {
            sendOrderBtn.disabled = true;
        }
    }

    sendOrderBtn.addEventListener('click', () => {
        const table = tableNumberInput.value.trim();
        let message = `¡Hola! Quisiera realizar el siguiente pedido para la *Mesa ${table}* en APU ROOTS Alta Cocina Andina:%0A%0A`;
        
        cart.forEach(item => {
            message += `- ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toFixed(2)})%0A`;
        });

        const total = cartTotal.textContent;
        message += `%0A*Total Estimado:* ${total}%0A¡Por favor confirmar pedido en mesa!`;

        const restaurantPhone = "51900136139"; // Reemplaza con tu número de WhatsApp
        const whatsappURL = `https://wa.me/${51900136139}?text=${message}`;

        window.open(whatsappURL, '_blank');

        cart = [];
        tableNumberInput.value = '';
        updateCartUI();
        cartModal.classList.add('hidden');
        alert('¡Pedido enviado al mesero con éxito!');
    });

    // 5. Validación de Formulario de Reserva y Envío Automático a WhatsApp
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        const nombre = document.getElementById('nombre');
        const correo = document.getElementById('correo');
        const telefono = document.getElementById('telefono');
        const mensaje = document.getElementById('mensaje');

        if (nombre.value.trim().length < 3) {
            setFieldError(nombre, true);
            isValid = false;
        } else {
            setFieldError(nombre, false);
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo.value.trim())) {
            setFieldError(correo, true);
            isValid = false;
        } else {
            setFieldError(correo, false);
        }

        if (telefono.value.trim().length < 7) {
            setFieldError(telefono, true);
            isValid = false;
        } else {
            setFieldError(telefono, false);
        }

        if (mensaje.value.trim().length < 10) {
            setFieldError(mensaje, true);
            isValid = false;
        } else {
            setFieldError(mensaje, false);
        }

       if (isValid) {
            // NUEVO: Construir el mensaje de reserva para WhatsApp
            let resMessage = `¡Hola! Deseo confirmar una nueva *Reserva de Mesa* en Apu Roots:%0A%0A`;
            resMessage += `- *Nombre:* ${nombre.value.trim()}%0A`;
            resMessage += `- *Correo:* ${correo.value.trim()}%0A`;
            resMessage += `- *Teléfono:* ${telefono.value.trim()}%0A`;
            resMessage += `- *Detalles:* ${mensaje.value.trim()}%0A%0A¡Por favor confirmar disponibilidad!`;

            const restaurantPhone = "51900136139"; // <--- CAMBIA ESTE NÚMERO POR TU WHATSAPP (con código de país, ej: 51 para Perú)
            const whatsappReservationURL = `https://wa.me/${51900136139}?text=${resMessage}`;

            // Abrir WhatsApp automáticamente con los datos de la reserva
            window.open(whatsappReservationURL, '_blank');

            // Mantener tu animación de éxito o mensaje en pantalla
            contactForm.classList.add('hidden');
            formSuccess.classList.remove('hidden');
            
            setTimeout(() => {
                contactForm.reset();
            }, 1000);
        }

    function setFieldError(inputElement, isError) {
        const formGroup = inputElement.parentElement;
        if (isError) {
            formGroup.classList.add('error');
        } else {
            formGroup.classList.remove('error');
        }
    }
})});
