import { home } from "../mapeos/home.js";
import { clickCartaMobil } from "../mapeos/clickCartaMobil.js";
import { carta } from "../mapeos/carta.js";
import { getCard } from "../fetchs/getCard.js";
import { footer } from "../mapeos/footer.js";
import { header } from "../mapeos/header.js";
import { paginas } from "../mapeos/paginas.js";
import { getAll } from "../fetchs/getAll.js";

// Función para extraer parámetros de la URL
function getParamsFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    let offset = parseInt(urlParams.get('offset') || 0);
    let limit = parseInt(urlParams.get('limit') || 10);

    let filters = {};
    urlParams.forEach((value, key) => {
        if (key !== 'offset' && key !== 'limit') {
            filters[key] = value;
        }
    });

    return { offset, limit, filters };
}

// Función para cargar header y footer
function loadHeaderAndFooter() {
    header().then(html => $('header').append(html));
    footer().then(html => $('footer').append(html));
}

// Función para obtener la cantidad total de páginas
function calculatePages() {
    return getAll().then(response => 
        response.json().then(data => {
            let totalCards = data.data.length;
            let aux = totalCards % 10;
            return (totalCards - aux) / 10; // Total de páginas
        })
    );
}

// Función para mapear las cartas y paginación
function displayCardsAndPagination(offset, limit, pag) {
    getCard(offset, limit).then(response => {
        if (response.ok) {
            response.json().then(data => {
                // Mapeo de las cartas
                data.data.forEach(card => {
                    carta(card.id, card.card_images[0].image_url).then(html => {
                        $('#main').append(html);
                    });
                });

                // Cargar la paginación
                calculatePages().then(resultado => {
                    paginas(pag, resultado).then(html => {
                        $('#main').append(html);
                    });
                });
            });
        } else {
            console.error('Error fetching data:', response.statusText);
        }
    }).catch(error => {
        console.error('Error fetching data:', error);
    });
}

// Función para manejar el click de las imágenes
function handleImageClick() {
    $(document).on("click", ".img", function(e) {
        e.stopPropagation(); // Detener la propagación del evento
        if (isOverlayActive) return; // No hacer nada si el overlay está activo

        let srcImagen = $(this).find("img.carta").attr("src");
        let id = $(this).parent().attr("id");

        // Activar el estado de overlay
        isOverlayActive = true;
        clickCartaMobil(id, srcImagen).then(html => {
            $('#main').append(html);
        });
    });
}

// Función para cerrar el overlay al hacer clic fuera
function handleOverlayClick() {
    $(document).on("mouseup", function(e) {
        if (isOverlayActive) {
            let container = $(".elemento"); // El div interno del overlay
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                $(".overlay").remove(); // Eliminar el overlay
                isOverlayActive = false; // Desactivar el estado de overlay
            }
        }
    });
}

// Función principal para inicializar la página
function initPage() {
    const { offset, limit, filters } = getParamsFromUrl();
    const pag = (offset / 10) + 1;
    
    loadHeaderAndFooter(); // Cargar el header y footer
    displayCardsAndPagination(offset, limit, pag); // Mostrar cartas y paginación
    handleImageClick(); // Manejar clicks en las imágenes
    handleOverlayClick(); // Manejar cierre del overlay
}

// Variable global para manejar el overlay
let isOverlayActive = false;

// Inicializar la página cuando el documento esté listo
$(document).ready(function() {
    initPage();
});


