// Motor de categoría — lee productos.json (fuente única de verdad)
// y pinta las cards de la categoría pedida en la URL (?cat=Pulseras).
// Requiere servirse por http(s) — no funciona abriendo el archivo directo (file://).

const WA_NUMBER = "18292685367";

function waLink(nombre) {
  const texto = encodeURIComponent(`Me interesa el/la ${nombre} que vi en su catalogo`);
  return `https://wa.me/${WA_NUMBER}?text=${texto}`;
}

function renderCard(p) {
  const div = document.createElement("div");
  div.className = "card";
  div.setAttribute("data-name", p.nombre);

  const precioHtml = p.precio === null
    ? `<p class="price">Precio a consultar</p>`
    : `<p class="price">RD$${p.precio.toFixed(2)}</p>`;

  const ctaHtml = p.precio === null
    ? `<a class="btn-add btn-whatsapp" href="${waLink(p.nombre)}" target="_blank">Consultar por WhatsApp</a>`
    : `<button onclick="addToCart('${p.nombre.replace(/'/g, "\\'")}', ${p.precio})">Agregar al carrito</button>`;

  if (p.precio !== null) div.setAttribute("data-price", p.precio);

  div.innerHTML = `
    <img src="${p.imagen}" alt="${p.nombre}">
    <div class="card-body">
      <h3>${p.nombre}</h3>
      ${precioHtml}
      <p class="desc">${p.descripcion}</p>
      ${ctaHtml}
    </div>
  `;
  return div;
}

async function cargarCategoria() {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get("cat");
  const heading = document.getElementById("catHeading");
  const container = document.getElementById("productContainer");
  const title = document.getElementById("pageTitle");

  if (!cat) {
    heading.textContent = "Categoría no especificada";
    container.innerHTML = '<p style="padding:0 32px;">Vuelve a <a href="Productos.html">Productos</a> y elige una categoría.</p>';
    return;
  }

  heading.textContent = cat;
  title.textContent = `${cat} | Cloffy.rd`;

  try {
    const res = await fetch("productos.json");
    const productos = await res.json();
    const filtrados = productos.filter(p => p.categoria === cat);

    container.innerHTML = "";
    if (filtrados.length === 0) {
      container.innerHTML = '<p style="padding:0 32px;">Aún no hay productos en esta categoría.</p>';
      return;
    }
    filtrados.forEach(p => container.appendChild(renderCard(p)));
  } catch (err) {
    container.innerHTML = '<p style="padding:0 32px;">No se pudo cargar el catálogo. Si abriste el archivo directamente desde tu computadora, súbelo a un hosting (ej. GitHub Pages) para que funcione.</p>';
    console.error(err);
  }
}

window.addEventListener("DOMContentLoaded", cargarCategoria);
