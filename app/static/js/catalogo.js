// ==========================================
// FUNCIONES GLOBALES DEL CARRITO DE COMPRAS
// ==========================================

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

window.toggleCarrito = function () {
  const modal = document.getElementById('cart-modal');
  if (!modal) return;

  if (modal.style.display === 'none' || modal.style.display === '' || modal.classList.contains('hidden')) {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
  } else {
    modal.style.display = 'none';
  }
};

window.actualizarCarritoUI = function () {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');
  const cartCountMobile = document.getElementById('cart-count-mobile');
  const cartTotal = document.getElementById('cart-total');

  let total = 0;
  let totalUnidades = 0;

  if (cartItemsContainer) {
    cartItemsContainer.innerHTML = '';

    if (carrito.length === 0) {
      cartItemsContainer.innerHTML = '<p style="text-align: center; color: #a8a29e; padding: 1.5rem 0; font-size: 0.75rem;">El carrito está vacío 🥛</p>';
    } else {
      carrito.forEach((prod, index) => {
        const subtotal = prod.precio * prod.cantidad;
        total += subtotal;
        totalUnidades += prod.cantidad;

        cartItemsContainer.innerHTML += `
          <div style="display: flex; align-items: center; justify-content: space-between; background-color: #fafaf9; padding: 0.75rem; border-radius: 0.75rem; border: 1px solid #e7e5e4; font-size: 0.75rem; margin-bottom: 0.5rem;" class="dark:bg-[#041F04] dark:border-stone-800">
            <div style="flex: 1; padding-right: 0.5rem;">
              <p style="font-weight: 700; color: #063B00; margin: 0;" class="dark:text-stone-100">${prod.nombre}</p>
              <span style="color: #a8a29e;">S/ ${prod.precio.toFixed(2)} c/u</span>
            </div>

            <!-- Botones + / - -->
            <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0 0.5rem;">
              <button onclick="cambiarCantidad(${index}, -1)" style="width: 1.5rem; height: 1.5rem; border-radius: 0.25rem; background-color: #e7e5e4; border: none; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center;">-</button>
              <span style="font-weight: 700;">${prod.cantidad}</span>
              <button onclick="cambiarCantidad(${index}, 1)" style="width: 1.5rem; height: 1.5rem; border-radius: 0.25rem; background-color: #e7e5e4; border: none; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center;">+</button>
            </div>

            <!-- Subtotal y Eliminar -->
            <div style="text-align: right; padding-left: 0.5rem;">
              <p style="font-weight: 700; color: #063B00; margin: 0;" class="dark:text-[#F69D39]">S/ ${subtotal.toFixed(2)}</p>
              <button onclick="eliminarDelCarrito(${index})" style="color: #ef4444; background: none; border: none; font-size: 0.625rem; text-decoration: underline; cursor: pointer; margin-top: 0.125rem;">Quitar</button>
            </div>
          </div>
        `;
      });
    }
  } else {
    carrito.forEach(prod => {
      totalUnidades += prod.cantidad;
    });
  }

  // Actualizar badges globales
  if (cartCount) cartCount.innerText = totalUnidades;
  if (cartCountMobile) cartCountMobile.innerText = totalUnidades;
  if (cartTotal) cartTotal.innerText = total.toFixed(2);

  localStorage.setItem('carrito', JSON.stringify(carrito));
};

window.agregarAlCarrito = function (btn) {
  const id = btn.getAttribute('data-id');
  const nombre = btn.getAttribute('data-nombre');
  const precio = parseFloat(btn.getAttribute('data-precio'));

  const productoExistente = carrito.find(item => item.id === id);

  if (productoExistente) {
    productoExistente.cantidad += 1;
  } else {
    carrito.push({ id, nombre, precio, cantidad: 1 });
  }

  actualizarCarritoUI();

  // Feedback visual
  [document.getElementById('cart-count'), document.getElementById('cart-count-mobile')].forEach(el => {
    if (el) {
      el.classList.add('scale-125');
      setTimeout(() => el.classList.remove('scale-125'), 200);
    }
  });
};

window.cambiarCantidad = function (index, cambio) {
  carrito[index].cantidad += cambio;
  if (carrito[index].cantidad <= 0) {
    carrito.splice(index, 1);
  }
  actualizarCarritoUI();
};

window.eliminarDelCarrito = function (index) {
  carrito.splice(index, 1);
  actualizarCarritoUI();
};

window.vaciarCarrito = function () {
  carrito = [];
  actualizarCarritoUI();
};

// ==========================================
// INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', function () {
  
  // 1. CARRUSEL DE IMÁGENES
  const images = [
    '/static/img/helado3.png',
    '/static/img/helado4.png'
  ];
  let currentIndex = 0;
  let autoSlideInterval;

  function updateCarousel() {
    const imgElement = document.getElementById('carousel-img');
    if (imgElement) {
      imgElement.style.opacity = '0';
      setTimeout(() => {
        imgElement.src = images[currentIndex];
        imgElement.style.opacity = '1';
      }, 200);
    }
  }

  window.nextSlide = function () {
    currentIndex = (currentIndex + 1) % images.length;
    updateCarousel();
    resetAutoSlide();
  };

  window.prevSlide = function () {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateCarousel();
    resetAutoSlide();
  };

  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      updateCarousel();
    }, 5000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  if (document.getElementById('carousel-img')) {
    startAutoSlide();
  }

  // 2. FILTRADO DE CATEGORÍAS
  window.filterCategory = function (category) {
    const cards = document.querySelectorAll('.product-card');
    const buttons = document.querySelectorAll('.cat-btn');

    buttons.forEach(btn => {
      if (btn.getAttribute('data-cat') === category) {
        btn.classList.add('bg-[#063B00]', 'text-white');
        btn.classList.remove('text-[#063B00]', 'dark:text-stone-200');
      } else {
        btn.classList.remove('bg-[#063B00]', 'text-white');
        btn.classList.add('text-[#063B00]', 'dark:text-stone-200');
      }
    });

    cards.forEach(card => {
      if (category === 'todos' || card.classList.contains(category)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  };

  // Cargar contador y estado del carrito
  actualizarCarritoUI();
});