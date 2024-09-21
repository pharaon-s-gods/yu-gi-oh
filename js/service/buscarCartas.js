import { home } from "../mapeos/home.js";
import { clickCartaMobil } from "../mapeos/clickCartaMobil.js";
import { carta } from "../mapeos/carta.js";
import { getCard } from "../fetchs/getCard.js";
import { footer } from "../mapeos/footer.js";
import { header } from "../mapeos/header.js";
import { paginas } from "../mapeos/paginas.js";
import { getAll } from "../fetchs/getAll.js";

// Variable global para manejar el overlay
let isOverlayActive = false;


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
                    carta(card).then(html => {
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

        let jsonString = $(this).attr("data-info");                                     // Obtener el JSON oculto en el atributo data-info
        let elemento = JSON.parse(jsonString); 

        let storedIds = JSON.parse(localStorage.getItem('cartasVisualizadasId')) || []; // Recuperar o inicializar el array de IDs

        // Si el ID ya existe, removerlo del array
        if (storedIds.includes(elemento.id)) {
            storedIds = storedIds.filter(id => id !== elemento.id);
        }
        storedIds.push(elemento.id);                                                // Agregar el ID al final del array

        //storedIds.unshift(elemento.id);                                           //Agregar el ID al principio del array
        localStorage.setItem('cartasVisualizadasId', JSON.stringify(storedIds));    // Guardar el array actualizado en localStorage

        // Activar el estado de overlay
        isOverlayActive = true;
        clickCartaMobil(elemento).then(html => {
            $('#main').append(html);
        });
    });
}

// Función para cerrar el overlay al hacer clic fuera
function handleOverlayClick() {
    $(document).on("mouseup", function(e) {
        if (isOverlayActive) {
            let container = $(".elemento, .share-icon, .detalle"); // Todos los elementos interactivos dentro del overlay
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                // El clic no fue en ninguno de los elementos internos
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


// Inicializar la página cuando el documento esté listo
$(document).ready(function() {
    initPage();
});


