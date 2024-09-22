document.addEventListener("DOMContentLoaded", () => {
    const carritoContainer = document.getElementById("carrito");
    const pageInfo = document.getElementById("page-info");
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");

    const resultadosPorPagina = 10;
    let paginaActual = 1;
    const idsEnCarrito = JSON.parse(localStorage.getItem("carritoIds")) || []; // Obtener los IDs del carrito

    async function obtenerCartaPorId(id) {
        try {
            const respuesta = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${id}`);
            if (!respuesta.ok) throw new Error("Error al obtener la carta");
            const data = await respuesta.json();
            return data.data[0]; // Retornar el primer elemento de la lista de cartas
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async function mostrarProductos() {
        const inicio = (paginaActual - 1) * resultadosPorPagina;
        const fin = inicio + resultadosPorPagina;
        const idsPaginados = idsEnCarrito.slice(inicio, fin);

        carritoContainer.innerHTML = ""; // Limpiar el contenido anterior

        const cartasPromises = idsPaginados.map(id => obtenerCartaPorId(id));
        const cartas = await Promise.all(cartasPromises);

        cartas.forEach(carta => {
            if (carta) {
                const div = document.createElement("div");
                div.classList.add("producto");
                div.innerHTML = `
                    <img src="${carta.card_images[0].image_url}" alt="${carta.name}" />
                    <h2>${carta.name}</h2>
                    <p>Precio: $${carta.card_prices[0].price || 'No disponible'}</p>
                `;
                carritoContainer.appendChild(div);
            } else {
                const div = document.createElement("div");
                div.textContent = "Error al cargar la carta"; // Mensaje de error
                carritoContainer.appendChild(div);
            }
        });

        actualizarBotones();
    }

    function actualizarBotones() {
        prevButton.disabled = paginaActual === 1;
        nextButton.disabled = paginaActual * resultadosPorPagina >= idsEnCarrito.length;
        pageInfo.textContent = `Página ${paginaActual} de ${Math.ceil(idsEnCarrito.length / resultadosPorPagina)}`;
    }

    prevButton.addEventListener("click", () => {
        if (paginaActual > 1) {
            paginaActual--;
            mostrarProductos();
        }
    });

    nextButton.addEventListener("click", () => {
        if (paginaActual * resultadosPorPagina < idsEnCarrito.length) {
            paginaActual++;
            mostrarProductos();
        }
    });

    // Inicializar la vista de productos
    mostrarProductos();
});
