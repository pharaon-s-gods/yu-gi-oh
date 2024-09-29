import { footer } from "../mapeos/footer.js";
import { header } from "../mapeos/header.js";

document.addEventListener("DOMContentLoaded", () => {
    const cartasHistorialContainer = document.getElementById("cartas-historial");
    const pageInfo = document.getElementById("page-info");
    const prevButton = document.getElementById("prev-page");
    const nextButton = document.getElementById("next-page");

    const ITEMS_PER_PAGE = 10;
    let currentPage = 1; // Pagina actual
    let cartasHistorial = JSON.parse(localStorage.getItem("cartasVisualizadasId")) || []; // Obtiene historial

    // Mensaje para mostrar si no hay cartas
    const noCartasMessage = document.createElement("div");
    noCartasMessage.className = "no-cartas-message";
    noCartasMessage.textContent = "No hay cartas en el historial.";
    noCartasMessage.style.display = "none"; // Ocultar inicialmente
    cartasHistorialContainer.appendChild(noCartasMessage); // Agrega el mensaje al contenedor

    async function obtenerCartaPorId(id) {
        try {
            const respuesta = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${id}`);
            if (!respuesta.ok) throw new Error("Error al obtener la carta");
            const data = await respuesta.json();
            return data.data[0]; // Retorna la primera carta
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async function renderCartas() {
        cartasHistorialContainer.innerHTML = ""; // Limpia el contenedor
        cartasHistorialContainer.appendChild(noCartasMessage);

        if (cartasHistorial.length === 0) {
            noCartasMessage.style.display = "block"; // Ocultar botones
            prevButton.style.display = "none";
            nextButton.style.display = "none";
            pageInfo.style.display = "none";
            return;
        }

        noCartasMessage.style.display = "none"; // Oculta el mensaje si hay cartas

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const cartasToShow = cartasHistorial.slice(startIndex, endIndex);

        const cartasPromises = cartasToShow.map(cartaId => obtenerCartaPorId(cartaId)); // Obtiene cartas por id
        const cartas = await Promise.all(cartasPromises); // Espera a que todas las promesas se resuelvan

        cartas.forEach(carta => {
            if (carta) { // Verifica si la carta existe
                const cartaElement = document.createElement("div"); // Crea un nuevo elemento para la carta
                cartaElement.className = "carta";
                cartaElement.innerHTML = `
                    <img src="${carta.card_images[0].image_url}" alt="${carta.name}">
                    <h2>${carta.name}</h2>
                    <p>Tipo: ${carta.type}</p>
                    <p>Raza: ${carta.race}</p>
                `; // Agrega contenido HTML
                cartasHistorialContainer.appendChild(cartaElement); // Agrega la carta al contenedor
            }
        });

        pageInfo.textContent = `Página ${currentPage} de ${Math.ceil(cartasHistorial.length / ITEMS_PER_PAGE)}`;
        prevButton.disabled = currentPage === 1; // Deshabilita boton de anterior si está en la primera pagina
        nextButton.disabled = currentPage === Math.ceil(cartasHistorial.length / ITEMS_PER_PAGE); // Deshabilita boton de siguiente si esta en la ultima pagina
    }

    async function loadPage() {
        await header().then(html => {
            $('header').append(html);
        });
        await footer().then(html => {
            $('footer').append(html);
        });
    }

    prevButton.addEventListener("click", () => {
        if (currentPage > 1) { // Verifica si no esta en la primera página
            currentPage--; // Resta uno a la pagina actual
            renderCartas(); // Renderiza las cartas
        }
    });

    nextButton.addEventListener("click", () => {
        if (currentPage < Math.ceil(cartasHistorial.length / ITEMS_PER_PAGE)) { // Verifica si no esta en la ultima pagina
            currentPage++; // Suma uno a la pagina actual
            renderCartas();
        }
    });

    // Carga el header y footer antes de renderizar las cartas
    loadPage().then(renderCartas); // Espera a que se cargue la pagina antes de renderizar
});
