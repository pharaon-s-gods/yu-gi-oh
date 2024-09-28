// Importa funciones para cargar el footer y header
import { footer } from "../mapeos/footer.js";
import { header } from "../mapeos/header.js";

document.addEventListener("DOMContentLoaded", () => {
    const cartasHistorialContainer = document.getElementById("cartas-historial");
    const pageInfo = document.getElementById("page-info");
    const prevButton = document.getElementById("prev-page");
    const nextButton = document.getElementById("next-page");

    const ITEMS_PER_PAGE = 10; // Cartas por pagina
    let currentPage = 1; // Pagina actual
    let cartasHistorial = JSON.parse(localStorage.getItem("cartasVisualizadasId")) || []; // Obtiene historial

    // Funcion asincrona para obtener carta por id
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

    // Funcion para renderizar cartas en el contenedor
    async function renderCartas() {
        cartasHistorialContainer.innerHTML = ""; // Limpia el contenedor

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE; // Calcula el indice inicial
        const endIndex = startIndex + ITEMS_PER_PAGE; // Calcula el indice final
        const cartasToShow = cartasHistorial.slice(startIndex, endIndex); // Selecciona cartas a mostrar

        const cartasPromises = cartasToShow.map(cartaId => obtenerCartaPorId(cartaId)); // Obtiene cartas por id
        const cartas = await Promise.all(cartasPromises); // Espera a que todas las promesas se resuelvan

        cartas.forEach(carta => {
            if (carta) { // Verifica si la carta existe
                const cartaElement = document.createElement("div"); // Crea un nuevo elemento para la carta
                cartaElement.className = "carta"; // Asigna clase
                cartaElement.innerHTML = `
                    <img src="${carta.card_images[0].image_url}" alt="${carta.name}">
                    <h2>${carta.name}</h2>
                    <p>Tipo: ${carta.type}</p>
                    <p>Raza: ${carta.race}</p>
                `; // Agrega contenido HTML
                cartasHistorialContainer.appendChild(cartaElement); // Agrega la carta al contenedor
            }
        });

        // Actualiza la informacion de la pagina
        pageInfo.textContent = `Pagina ${currentPage} de ${Math.ceil(cartasHistorial.length / ITEMS_PER_PAGE)}`;
        prevButton.disabled = currentPage === 1; // Deshabilita boton de anterior si esta en la primera pagina
        nextButton.disabled = currentPage === Math.ceil(cartasHistorial.length / ITEMS_PER_PAGE); // Deshabilita boton de siguiente si esta en la ultima pagina
    }

    // Carga el header y footer
    async function loadPage() {
        await header().then(html => {
            $('header').append(html);
        });
        await footer().then(html => {
            $('footer').append(html);
        });
    }

    // Botones de navegacion
    prevButton.addEventListener("click", () => {
        if (currentPage > 1) { // Verifica si no esta en la primera pagina
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
