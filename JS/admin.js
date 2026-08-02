// Panel de administración — versión local (sin backend todavía).
// Los "borradores" viven en localStorage de este navegador hasta que se publican.
// Cuando se conecte Cloudinary/Supabase, solo hay que cambiar guardarBorrador()
// y descargarTodo() por llamadas reales a la API — el formulario no cambia.

const CLAVE_ADMIN = "cloffy2026"; // cámbiala cuando quieras, es solo un candado simple
const LS_KEY = "cloffy_admin_drafts";

let productosExistentes = [];
let archivoActual = null; // File del <input type=file> seleccionado

// ---------- LOGIN ----------
function intentarEntrar() {
  const val = document.getElementById("pass").value;
  if (val === CLAVE_ADMIN) {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("panel").style.display = "block";
    sessionStorage.setItem("cloffy_admin_ok", "1");
    iniciarPanel();
  } else {
    document.getElementById("loginError").style.display = "block";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("cloffy_admin_ok") === "1") {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("panel").style.display = "block";
    iniciarPanel();
  }
});

// ---------- INICIO DEL PANEL ----------
async function iniciarPanel() {
  try {
    const res = await fetch("productos.json");
    productosExistentes = await res.json();
  } catch (err) {
    productosExistentes = [];
    console.warn("No se pudo leer productos.json (¿estás corriendo un servidor local?)", err);
  }
  llenarCategorias();
  renderDraft();
}

function llenarCategorias() {
  const sel = document.getElementById("categoria");
  const categorias = [...new Set(productosExistentes.map(p => p.categoria))].sort();
  sel.innerHTML = '<option value="">-- elige --</option>' +
    categorias.map(c => `<option value="${c}">${c}</option>`).join("");
}

// ---------- IMAGEN ----------
function previsualizar() {
  const input = document.getElementById("imagen");
  archivoActual = input.files[0] || null;
  const preview = document.getElementById("preview");
  if (!archivoActual) { preview.style.display = "none"; return; }
  const reader = new FileReader();
  reader.onload = e => {
    preview.src = e.target.result;
    preview.style.display = "block";
  };
  reader.readAsDataURL(archivoActual);
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ---------- DRAFTS (localStorage) ----------
function leerDrafts() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch { return []; }
}

function guardarDrafts(drafts) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(drafts));
  } catch (err) {
    alert("No se pudo guardar en el navegador (posiblemente por el tamaño de las imágenes). Publica los pendientes antes de agregar más.");
    console.error(err);
  }
}

function siguienteNumero(categoria, drafts) {
  const numeros = [];
  productosExistentes.filter(p => p.categoria === categoria).forEach(p => {
    const m = p.imagen.match(/(\d+)\.\w+$/);
    if (m) numeros.push(parseInt(m[1], 10));
  });
  drafts.filter(d => d.categoria === categoria).forEach(d => {
    const m = d.nombreArchivo.match(/(\d+)\.\w+$/);
    if (m) numeros.push(parseInt(m[1], 10));
  });
  return numeros.length ? Math.max(...numeros) + 1 : 1;
}

async function agregarBorrador() {
  const categoria = document.getElementById("categoriaNueva").value.trim() || document.getElementById("categoria").value;
  const nombre = document.getElementById("nombre").value.trim();
  const precioRaw = document.getElementById("precio").value;
  const descripcion = document.getElementById("descripcion").value.trim();

  if (!categoria) { alert("Elige o escribe una categoría."); return; }
  if (!nombre) { alert("Escribe el nombre del producto."); return; }
  if (!archivoActual) { alert("Selecciona una foto."); return; }

  const drafts = leerDrafts();
  const ext = archivoActual.name.split(".").pop().toLowerCase();
  const numero = siguienteNumero(categoria, drafts);
  const nombreArchivo = `IMG/${categoria}/${numero}.${ext}`;
  const base64 = await fileToBase64(archivoActual);

  drafts.push({
    categoria,
    nombre,
    precio: precioRaw === "" ? null : parseFloat(precioRaw),
    descripcion: descripcion || `${nombre}.`,
    nombreArchivo,
    base64
  });
  guardarDrafts(drafts);
  renderDraft();

  // limpiar formulario
  document.getElementById("categoriaNueva").value = "";
  document.getElementById("nombre").value = "";
  document.getElementById("precio").value = "";
  document.getElementById("descripcion").value = "";
  document.getElementById("imagen").value = "";
  document.getElementById("preview").style.display = "none";
  archivoActual = null;
}

function eliminarBorrador(idx) {
  const drafts = leerDrafts();
  drafts.splice(idx, 1);
  guardarDrafts(drafts);
  renderDraft();
}

function renderDraft() {
  const drafts = leerDrafts();
  const tbody = document.querySelector("#tablaDraft tbody");
  const vacioMsg = document.getElementById("vacioMsg");
  document.getElementById("conteo").textContent = drafts.length;

  tbody.innerHTML = "";
  if (drafts.length === 0) {
    vacioMsg.style.display = "block";
    return;
  }
  vacioMsg.style.display = "none";

  drafts.forEach((d, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><img src="${d.base64}" alt="${d.nombre}"></td>
      <td>${d.categoria}</td>
      <td>${d.nombre}</td>
      <td>${d.precio === null ? "A consultar" : "RD$" + d.precio.toFixed(2)}</td>
      <td><button class="btn btn-danger" style="padding:6px 10px;font-size:0.75rem;" onclick="eliminarBorrador(${idx})">Quitar</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function vaciarLista() {
  if (confirm("¿Vaciar todos los pendientes? Esto no se puede deshacer.")) {
    localStorage.removeItem(LS_KEY);
    renderDraft();
  }
}

// ---------- PUBLICAR (descarga imágenes + productos.json) ----------
function descargarArchivo(nombre, blobOContenido, esTexto) {
  const blob = esTexto ? new Blob([blobOContenido], { type: "application/json" }) : blobOContenido;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombre;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function descargarTodo() {
  const drafts = leerDrafts();
  if (drafts.length === 0) { alert("No hay nada pendiente por publicar."); return; }

  // 1) descargar cada imagen con el nombre sugerido (solo el nombre de archivo, sin carpetas —
  //    el navegador no puede crear carpetas solo; la carpeta la pones tú al subir a GitHub)
  for (const d of drafts) {
    const res = await fetch(d.base64);
    const blob = await res.blob();
    const soloNombre = d.nombreArchivo.split("/").pop();
    descargarArchivo(soloNombre, blob, false);
    // pequeña pausa para que el navegador no bloquee descargas múltiples
    await new Promise(r => setTimeout(r, 300));
  }

  // 2) armar productos.json actualizado
  let siguienteId = productosExistentes.length
    ? Math.max(...productosExistentes.map(p => p.id)) + 1
    : 1;

  const nuevos = drafts.map(d => ({
    id: siguienteId++,
    categoria: d.categoria,
    nombre: d.nombre,
    imagen: d.nombreArchivo,
    precio: d.precio,
    descripcion: d.descripcion
  }));

  const actualizado = [...productosExistentes, ...nuevos];
  descargarArchivo("productos.json", JSON.stringify(actualizado, null, 2), true);

  alert("Listo. Revisa tu carpeta de descargas: si dos imágenes de categorías distintas tenían el mismo número, el navegador le puso (1) al segundo nombre — renómbralo de vuelta antes de subirlo. La tabla de pendientes te dice a qué carpeta IMG/<Categoría>/ va cada una. Sube las imágenes, reemplaza productos.json en GitHub y espera el redeploy de Vercel.");
}
