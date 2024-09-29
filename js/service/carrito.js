import { footer } from "../mapeos/footer.js";
import { header } from "../mapeos/header.js";

async function loadPage() {
    const headerHtml = await header();
    $('header').html(headerHtml);
    const footerHtml = await footer();
    $('footer').html(footerHtml);
}

document.addEventListener("DOMContentLoaded", () => {
    const carritoContainer = document.getElementById("carrito");
    const pageInfo = document.getElementById("page-info");
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");

    const resultadosPorPagina = 10; 
    let paginaActual = 1; 
    const idsEnCarrito = JSON.parse(localStorage.getItem("carritoIds")) || {}; 

    // Obtiene carta por id desde la api
    async function obtenerCartaPorId(id) {
        try {
            const respuesta = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${id}`);
            if (!respuesta.ok) throw new Error("Error al obtener la carta");
            const data = await respuesta.json();
            return data.data[0]; 
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    // Muestra los productos en el carrito
    async function mostrarProductos() {
        // Guarda el scroll para restaurarlo despues
        const scrollPosition = window.scrollY; 

        // Limpia el contenedor del carrito
        while (carritoContainer.firstChild) {
            carritoContainer.removeChild(carritoContainer.firstChild);
        }

        const inicio = (paginaActual - 1) * resultadosPorPagina;
        const fin = inicio + resultadosPorPagina;
        const idsPaginados = Object.keys(idsEnCarrito).slice(inicio, fin); 

        const cartasPromises = idsPaginados.map(id => obtenerCartaPorId(id)); 
        const cartas = await Promise.all(cartasPromises); 

        cartas.forEach(carta => {
            const div = document.createElement("div");
            div.classList.add("producto");
            div.setAttribute("data-id", carta.id); 
            div.innerHTML = carta ? `
                <div class="producto-imagen-titulo">
                    <img src="${carta.card_images[0].image_url}" alt="${carta.name}" />
                    <h2>${carta.name}</h2>
                    <p>Tipo: ${carta.type}</p>
                    <p>Raza: ${carta.race}</p>
                </div>
                <div class="producto-cantidad-botones">
                    <p class="cantidad">Cantidad: <span id="cantidad-${carta.id}">${idsEnCarrito[carta.id]}</span></p>
                    <button class="btn-mas" data-id="${carta.id}">+</button>
                    <button class="btn-menos" data-id="${carta.id}">-</button>
                    <button class="btn-eliminar" data-id="${carta.id}">Eliminar todo</button>
                </div>
            ` : `
                <div>Error al cargar la carta</div>
            `;

            carritoContainer.appendChild(div); 
        });

        actualizarBotones(); 
        agregarEventos(); 

        // Restaura la posicion del scroll
        window.scrollTo(0, scrollPosition);
    }

    // Actualiza el innerHTML de la cantidad en el DOM
    async function actualizarCantidadEnDOM(id) {
        const cantidadElemento = carritoContainer.querySelector(`span#cantidad-${id}`);
        if (cantidadElemento) {
            cantidadElemento.textContent = idsEnCarrito[id];
        }
    }

    // Agrega eventos a los botones
    function agregarEventos() {
        const btnMas = document.querySelectorAll(".btn-mas");
        const btnMenos = document.querySelectorAll(".btn-menos");
        const btnEliminar = document.querySelectorAll(".btn-eliminar");

        btnMas.forEach(btn => {
            btn.addEventListener("click", async (e) => {
                e.preventDefault(); 
                const id = e.target.dataset.id;
                idsEnCarrito[id] += 1; 
                localStorage.setItem("carritoIds", JSON.stringify(idsEnCarrito)); 
                await actualizarCantidadEnDOM(id); 
            });
        });

        btnMenos.forEach(btn => {
            btn.addEventListener("click", async (e) => {
                e.preventDefault();
                const id = e.target.dataset.id;        
        
                if (idsEnCarrito[id] > 1) {
                    idsEnCarrito[id] -= 1; 
                    localStorage.setItem("carritoIds", JSON.stringify(idsEnCarrito));
                    await actualizarCantidadEnDOM(id);
                } else {
                    delete idsEnCarrito[id]; 
                    localStorage.setItem("carritoIds", JSON.stringify(idsEnCarrito));
                    await mostrarProductos(); 
                }
            });
        });        

        btnEliminar.forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                const id = e.target.dataset.id;
        
                delete idsEnCarrito[id];
                localStorage.setItem("carritoIds", JSON.stringify(idsEnCarrito));
        
                const cartaElemento = document.querySelector(`div[data-id="${id}"]`);
                if (cartaElemento) {
                    cartaElemento.remove();
                }
        
                const totalProductosRestantes = Object.keys(idsEnCarrito).length;
                const totalPaginas = Math.ceil(totalProductosRestantes / resultadosPorPagina);
        
                if (paginaActual > totalPaginas) {
                    paginaActual = totalPaginas;
                }
        
                mostrarProductos();
            });
        });
    }

    // Actualiza los botones de paginacion
    function actualizarBotones() {
        prevButton.disabled = paginaActual === 1; 
        nextButton.disabled = paginaActual * resultadosPorPagina >= Object.keys(idsEnCarrito).length; 
        pageInfo.textContent = `Página ${paginaActual} de ${Math.ceil(Object.keys(idsEnCarrito).length / resultadosPorPagina)}`; 
    }

    // Listeners para los botones de paginacion
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

    // Inicializa la vista de productos
    mostrarProductos();

    // Carga el header y footer
    loadPage();
});
