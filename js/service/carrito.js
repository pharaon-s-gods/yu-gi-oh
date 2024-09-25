import { footer } from "../mapeos/footer.js";
import { header } from "../mapeos/header.js";

// Función para cargar header y footer
function loadPage() {
    header().then(html => {
        $('header').html(html);
    });
    footer().then(html => {
        $('footer').html(html);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const carritoContainer = document.getElementById("carrito");
    const pageInfo = document.getElementById("page-info");
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");

    const resultadosPorPagina = 10;
    let paginaActual = 1;
    const idsEnCarrito = JSON.parse(localStorage.getItem("carritoIds")) || {}; // Obtener los IDs y cantidades del carrito

    // Función para obtener la carta por ID
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

    // Función para mostrar los productos en el carrito
    async function mostrarProductos() {
        const inicio = (paginaActual - 1) * resultadosPorPagina;
        const fin = inicio + resultadosPorPagina;
        const idsPaginados = Object.keys(idsEnCarrito).slice(inicio, fin);

        carritoContainer.innerHTML = ""; // Limpiar el contenido anterior

        const cartasPromises = idsPaginados.map(id => obtenerCartaPorId(id));
        const cartas = await Promise.all(cartasPromises);

        cartas.forEach(carta => {
            if (carta) {
                const cantidad = idsEnCarrito[carta.id];
                const div = document.createElement("div");
                div.classList.add("producto");
                div.setAttribute("data-id", carta.id); // Agregar data-id para identificarlas
                div.innerHTML = `
                    <div class="producto-imagen-titulo">
                        <img src="${carta.card_images[0].image_url}" alt="${carta.name}" />
                        <h2>${carta.name}</h2>
                    </div>
                    <div class="producto-cantidad-botones">
                        <p class="cantidad" style="color: yellow;">Cantidad: <span id="cantidad-${carta.id}">${cantidad}</span></p>
                        <button class="btn-mas" data-id="${carta.id}">+</button>
                        <button class="btn-menos" data-id="${carta.id}">-</button>
                        <button class="btn-eliminar" data-id="${carta.id}">Eliminar todo</button>
                    </div>
                `;

                carritoContainer.appendChild(div);
            } else {
                const div = document.createElement("div");
                div.textContent = "Error al cargar la carta"; // Mensaje de error
                carritoContainer.appendChild(div);
            }
        });

        actualizarBotones();
        agregarEventos(); // Agregar eventos a los botones después de cargar los productos
    }

    // Función para actualizar una carta en el carrito
    async function actualizarCarta(id) {
        const carta = await obtenerCartaPorId(id);
        const cantidad = idsEnCarrito[id];
        const div = carritoContainer.querySelector(`.producto[data-id="${id}"]`); // Seleccionar el div específico

        if (carta && div) {
            div.innerHTML = `
                <div class="producto-imagen-titulo">
                    <img src="${carta.card_images[0].image_url}" alt="${carta.name}" />
                    <h2>${carta.name}</h2>
                </div>
                <div class="producto-cantidad-botones">
                    <p class="cantidad" style="color: yellow;">Cantidad: <span id="cantidad-${carta.id}">${cantidad}</span></p>
                    <button class="btn-mas" data-id="${carta.id}">+</button>
                    <button class="btn-menos" data-id="${carta.id}">-</button>
                    <button class="btn-eliminar" data-id="${carta.id}">Eliminar todo</button>
                </div>
            `;

            agregarEventos(); // Reagregar eventos a los nuevos botones
        }
    }

    // Función para agregar eventos a los botones
    function agregarEventos() {
        const btnMas = document.querySelectorAll(".btn-mas");
        const btnMenos = document.querySelectorAll(".btn-menos");
        const btnEliminar = document.querySelectorAll(".btn-eliminar");

        btnMas.forEach(btn => {
            btn.addEventListener("click", async (e) => {
                e.preventDefault(); // Evitar el comportamiento predeterminado
                const id = e.target.dataset.id;
                idsEnCarrito[id] += 1; // Aumentar cantidad
                localStorage.setItem("carritoIds", JSON.stringify(idsEnCarrito));
                await actualizarCarta(id); // Solo actualizar la carta modificada
            });
        });

        btnMenos.forEach(btn => {
            btn.addEventListener("click", async (e) => {
                e.preventDefault(); // Evitar el comportamiento predeterminado
                const id = e.target.dataset.id;
                if (idsEnCarrito[id] > 1) {
                    idsEnCarrito[id] -= 1; // Disminuir cantidad
                } else {
                    delete idsEnCarrito[id]; // Eliminar si la cantidad llega a 0
                }
                localStorage.setItem("carritoIds", JSON.stringify(idsEnCarrito));
                mostrarProductos(); // Mostrar los productos después de actualizar
            });
        });

        btnEliminar.forEach(btn => {
            btn.addEventListener("click", async (e) => {
                e.preventDefault(); // Evitar el comportamiento predeterminado
                const id = e.target.dataset.id;
                delete idsEnCarrito[id]; // Eliminar todas las instancias de esta carta
                localStorage.setItem("carritoIds", JSON.stringify(idsEnCarrito));
                // Evitar la recarga visual
                carritoContainer.style.opacity = '0'; // Hacer el contenedor invisible
                await mostrarProductos(); // Volver a mostrar los productos después de eliminar
                carritoContainer.style.opacity = '1'; // Hacer el contenedor visible nuevamente
            });
        });
    }

    // Función para actualizar los botones de paginación
    function actualizarBotones() {
        prevButton.disabled = paginaActual === 1;
        nextButton.disabled = paginaActual * resultadosPorPagina >= Object.keys(idsEnCarrito).length;
        pageInfo.textContent = `Página ${paginaActual} de ${Math.ceil(Object.keys(idsEnCarrito).length / resultadosPorPagina)}`;
    }

    // Listeners para los botones de paginación
    prevButton.addEventListener("click", () => {
        if (paginaActual > 1) {
            paginaActual--;
            mostrarProductos();
        }
    });

    nextButton.addEventListener("click", () => {
        if (paginaActual * resultadosPorPagina < Object.keys(idsEnCarrito).length) {
            paginaActual++;
            mostrarProductos();
        }
    });

    // Inicializar la vista de productos
    mostrarProductos();

    // Cargar el header y footer
    loadPage();
});
