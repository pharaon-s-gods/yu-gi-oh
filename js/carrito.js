const idsEnCarrito = JSON.parse(localStorage.getItem("carrito")) || []; // Obtener los IDs del carrito
const resultadosPorPagina = 10;
let paginaActual = 1;

async function obtenerCartaPorId(id) {
    try {
        const respuesta = await fetch(`https://api.yugioh.com/cards/${id}`); // Ajusta la URL según la API que estés usando
        if (!respuesta.ok) throw new Error("Error al obtener la carta");
        return await respuesta.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function mostrarProductos() {
    const inicio = (paginaActual - 1) * resultadosPorPagina;
    const fin = inicio + resultadosPorPagina;
    const idsPaginados = idsEnCarrito.slice(inicio, fin);

    const carritoDiv = document.getElementById("carrito");
    carritoDiv.innerHTML = ""; // Limpiar el contenido anterior

    const cartasPromises = idsPaginados.map(id => obtenerCartaPorId(id));
    const cartas = await Promise.all(cartasPromises);

    cartas.forEach(carta => {
        if (carta) {
            const div = document.createElement("div");
            div.classList.add("producto");
            div.innerHTML = `
                <img src="${carta.imageUrl}" alt="${carta.name}" />
                <h2>${carta.name}</h2>
                <p>Precio: $${carta.price}</p>
            `;
            carritoDiv.appendChild(div);
        }
    });

    actualizarBotones();
}

function actualizarBotones() {
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");
    const pageInfo = document.getElementById("page-info");

    prevButton.disabled = paginaActual === 1;
    nextButton.disabled = paginaActual * resultadosPorPagina >= idsEnCarrito.length;
    pageInfo.textContent = `Página ${paginaActual} de ${Math.ceil(idsEnCarrito.length / resultadosPorPagina)}`;
}

document.getElementById("prev").addEventListener("click", () => {
    if (paginaActual > 1) {
        paginaActual--;
        mostrarProductos();
    }
});

document.getElementById("next").addEventListener("click", () => {
    if (paginaActual * resultadosPorPagina < idsEnCarrito.length) {
        paginaActual++;
        mostrarProductos();
    }
});

// Inicializar la vista de productos
mostrarProductos();
