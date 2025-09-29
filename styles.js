// --- Suposiciones iniciales ---
const userActions = document.getElementById('userActions');
const productsContainer = document.getElementById('products');
const btnCategories = document.querySelectorAll('.btn-category');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const cartBtn = document.getElementById('cartBtn');
const cart = document.getElementById('cart');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalSpan = document.getElementById('cartTotal');
const closeCartBtn = document.getElementById('closeCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');

let usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];



let categoriaSeleccionada = 'verduras';  

function mostrarProductos() {
  let lista = products.filter(p => p.categoria === categoriaSeleccionada);

  const query = searchInput.value.trim().toLowerCase();
  if (query !== '') {
    lista = lista.filter(p => p.nombre.toLowerCase().includes(query));
  }

  productsContainer.innerHTML = '';
  if (lista.length === 0) {
    productsContainer.innerHTML = '<p>No hay productos que coincidan.</p>';
    return;
  }

  lista.forEach(prod => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}" />
      <div class="product-info">
        <h3>${prod.nombre}</h3>
        <p>S/ ${prod.precio.toFixed(2)} por kg</p>
        <input type="number" min="1" value="1" />
        <button>Agregar al carrito</button>
      </div>
    `;
    card.querySelector('button').addEventListener('click', () => {
      const cantidad = parseInt(card.querySelector('input').value);
      if (cantidad > 0) {
        agregarAlCarrito(prod, cantidad);
      } else {
        alert('Ingrese una cantidad válida.');
      }
    });

    productsContainer.appendChild(card);
  });
}

function agregarAlCarrito(prod, cantidad) {
  const idx = carrito.findIndex(item => item.id === prod.id);
  if (idx !== -1) {
    carrito[idx].cantidad += cantidad;
  } else {
    carrito.push({ ...prod, cantidad });
  }
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarCarritoUI();
  alert(`${prod.nombre} agregado al carrito.`);
}

function actualizarCarritoUI() {
  cartItemsContainer.innerHTML = '';
  let total = 0;
  if (carrito.length === 0) {
    cartItemsContainer.innerHTML = '<li>Carrito vacío</li>';
  } else {
    carrito.forEach(item => {
      total += item.precio * item.cantidad;
      const li = document.createElement('li');
      li.innerText = `${item.nombre} x${item.cantidad} - S/ ${(item.precio * item.cantidad).toFixed(2)}`;
      cartItemsContainer.appendChild(li);
    });
  }
  cartTotalSpan.textContent = total.toFixed(2);
  document.getElementById('cartCount').textContent = carrito.reduce((acc, it) => acc + it.cantidad, 0);
}

cartBtn.addEventListener('click', () => {
  cart.classList.toggle('hidden');
});
closeCartBtn.addEventListener('click', () => {
  cart.classList.add('hidden');
});
checkoutBtn.addEventListener('click', () => {
  alert('Gracias por tu compra (simulado).');
  carrito = [];
  actualizarCarritoUI();
  localStorage.removeItem('carrito');
  cart.classList.add('hidden');
});

btnCategories.forEach(btn => {
  btn.addEventListener('click', () => {
    categoriaSeleccionada = btn.dataset.category;
    searchInput.value = '';
    mostrarProductos();
  });
});

searchBtn.addEventListener('click', mostrarProductos);
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    mostrarProductos();
  }
});

function mostrarOpcionesUsuario() {
  if (usuarioActivo) {
    userActions.innerHTML = `
      <span>Hola, ${usuarioActivo.nombre}</span>
      <button id="logoutBtn">Cerrar sesión</button>
    `;
    document.getElementById('logoutBtn').addEventListener('click', () => {
      localStorage.removeItem('usuarioActivo');
      usuarioActivo = null;
      mostrarOpcionesUsuario();
    });
  } else {
    userActions.innerHTML = `
      <button id="loginBtn">Login</button>
      <button id="registerBtn">Registro</button>
    `;
    document.getElementById('loginBtn').addEventListener('click', () => {

      const nombre = prompt('Ingresa tu nombre para login:');
      if (nombre) {
        usuarioActivo = { nombre };
        localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActivo));
        mostrarOpcionesUsuario();
      }
    });
    document.getElementById('registerBtn').addEventListener('click', () => {
      const nombre = prompt('Ingresa tu nombre para registro:');
      if (nombre) {
        usuarioActivo = { nombre };
        localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActivo));
        mostrarOpcionesUsuario();
      }
    });
  }
}

// Inicialización
mostrarOpcionesUsuario();
mostrarProductos();
actualizarCarritoUI();