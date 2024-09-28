import { footer } from "../mapeos/footer.js";
import { header } from "../mapeos/header.js";

// Funcion para cargar el header y footer de la pagina
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

    const resultadosPorPagina = 10; // Definir resultados por pagina
    let paginaActual = 1; // Inicializar la pagina actual
    const idsEnCarrito = JSON.parse(localStorage.getItem("carritoIds")) || {}; // Obtener los ids y cantidades del carrito

    // Obtener la carta por ID desde la API
    async function obtenerCartaPorId(id) {
        try {
            const respuesta = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${id}`);
            if (!respuesta.ok) throw new Error("Error al obtener la carta");
            const data = await respuesta.json();
            return data.data[0]; // Retornar el primer elemento
        } catch (error) {
            console.error(error); // Manejar el error
            return null;
        }
    }

    // Mostrar los productos en el carrito
    async function mostrarProductos() {
        const inicio = (paginaActual - 1) * resultadosPorPagina;
        const fin = inicio + resultadosPorPagina;
        const idsPaginados = Object.keys(idsEnCarrito).slice(inicio, fin); // Paginacion de ids

        carritoContainer.innerHTML = ""; // Limpiar el contenido anterior

        const cartasPromises = idsPaginados.map(id => obtenerCartaPorId(id)); // Obtener cartas en paralelo
        const cartas = await Promise.all(cartasPromises); // Esperar a que se resuelvan todas las promesas

        cartas.forEach(carta => {
            if (carta) {
                const cantidad = idsEnCarrito[carta.id]; // Obtener cantidad de cada carta
                const div = document.createElement("div");
                div.classList.add("producto");
                div.setAttribute("data-id", carta.id); // Agregar data id para identificarlas
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

                carritoContainer.appendChild(div); // Añadir el div del producto al contenedor
            } else {
                const div = document.createElement("div");
                div.textContent = "Error al cargar la carta"; // Mensaje de error
                carritoContainer.appendChild(div);
            }
        });

        actualizarBotones(); // Actualizar el estado de los botones de paginacion
        agregarEventos(); // Agregar eventos a los botones después de cargar los productos
    }

    // Funcion para actualizar una carta en el carrito
    async function actualizarCarta(id) {
        const carta = await obtenerCartaPorId(id); // Obtener la carta actualizada
        const cantidad = idsEnCarrito[id];
        const div = carritoContainer.querySelector(`.producto[data-id="${id}"]`); // Seleccionar el div especifico

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

    // Agregar eventos a los botones
    function agregarEventos() {
        const btnMas = document.querySelectorAll(".btn-mas");
        const btnMenos = document.querySelectorAll(".btn-menos");
        const btnEliminar = document.querySelectorAll(".btn-eliminar");

        btnMas.forEach(btn => {
            btn.addEventListener("click", async (e) => {
                e.preventDefault(); // Evitar el comportamiento predeterminado
                const id = e.target.dataset.id;
                idsEnCarrito[id] += 1; // Aumentar cantidad
                localStorage.setItem("carritoIds", JSON.stringify(idsEnCarrito)); // Actualizar localStorage
                await actualizarCarta(id); // Solo actualizar la carta modificada
            });
        });

        btnMenos.forEach(btn => {
            btn.addEventListener("click", async (e) => {
                e.preventDefault();
                const id = e.target.dataset.id;

                if (idsEnCarrito[id] > 1) {
                    idsEnCarrito[id] -= 1; // Disminuir cantidad
                } else {
                    delete idsEnCarrito[id]; // Eliminar si la cantidad es 0
                }
                
                localStorage.setItem("carritoIds", JSON.stringify(idsEnCarrito));
                
                // Solo actualizar el elemento especifico
                const cantidadElement = carritoContainer.querySelector(`#cantidad-${id}`);
                if (cantidadElement) {
                    cantidadElement.textContent = idsEnCarrito[id] || 0; // Actualiza la cantidad en la ui
                }

                // Actualizar botones y pagina, pero no recargar toda la lista
                actualizarBotones();
            });
        });

        btnEliminar.forEach(btn => {
            btn.addEventListener("click", async (e) => {
                e.preventDefault();
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

    // Funcion para actualizar los botones de paginacion
    function actualizarBotones() {
        prevButton.disabled = paginaActual === 1; // Deshabilitar el boton anterior si es la primera pagina
        nextButton.disabled = paginaActual * resultadosPorPagina >= Object.keys(idsEnCarrito).length; // Deshabilitar el boton siguiente si no hay mas paginas
        pageInfo.textContent = `Página ${paginaActual} de ${Math.ceil(Object.keys(idsEnCarrito).length / resultadosPorPagina)}`; // Mostrar info de paginacion
    }

    // Listeners para los botones de paginacion
    prevButton.addEventListener("click", () => { // Boton retroceder
        if (paginaActual > 1) {
            paginaActual--;
            mostrarProductos();
        }
    });

    nextButton.addEventListener("click", () => { // Boton avanzar
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
