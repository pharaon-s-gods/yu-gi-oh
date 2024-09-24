import { getAll } from "../fetchs/getAll.js";
import { getCard } from "../fetchs/getCard.js";
import { getArchetypes } from "../fetchs/getArchetypes.js";
import { carta } from "../mapeos/carta.js";
import { footer } from "../mapeos/footer.js";
import { header } from "../mapeos/header.js";
import { navBar } from "../mapeos/navBar.js";
import { sinCartas } from "../mapeos/sinCartas.js";
import { paginas } from "../mapeos/paginas.js";
import { clickCartaMobil } from "../mapeos/clickCartaMobil.js";

// Variable global para manejar el overlay
let isOverlayActive = false;


// Función para extraer parámetros de la URL
function getParamsFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    let offset = parseInt(urlParams.get('offset') || 0);
    let limit = 10;

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

function loadNavbar(filters) {
    getArchetypes().then(response => {
        if (response.ok) {
            response.json().then(archetypes => {
                navBar(archetypes, filters).then(html => {
                    // Selecciona el elemento por la clase 'navbar'
                    $('nav').append(html);
                });
            });
        } else {
            console.error('Error fetching data:', response.statusText);
        }
    }).catch(error => {
        console.error('Error fetching data:', error);
    });
}

// Función para obtener la cantidad total de páginas
function calculatePages() {
    return getAll().then(response => 
        response.json().then(data => {
            return data.data.length;
        })
    );
}

// Función para mapear las cartas y paginación
async function displayCardsAndPagination(offset, limit, pag) {
    try {
        // Hacer el primer fetch usando await
        const response = await getCard(offset, limit);
        if (!response.ok) {
            // Si la respuesta no es exitosa, lanzar un error con el mensaje de estado
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
        // Parsear los datos de la respuesta
        const data = await response.json();
        // Mapeo de las cartas
        for (const card of data.data) {
            const html = await carta(card);
            $('#main').append(html);
        }
        // Calcular las páginas
        const totalCartas = await calculatePages();
        // Generar la paginación
        const paginacionHTML = await paginas(pag, totalCartas);
        $('#main').append(paginacionHTML);
    } catch (error) {
        const html = await sinCartas();
        $('main').html(html);
    }
}




// Función para manejar los eventos y recargar la página con los parámetros de la URL
function handleFilters() {
    // Obtener los valores actuales de los inputs
    const nombre = $('#nombre').val();
    const tipo = $('#tipo').val();
    const raza = $('#raza').val();
    const arquetipo = $('#arquetipo').val();

    // Crear un objeto para almacenar los parámetros
    let params = {};

    // Agregar los parámetros solo si tienen valor, usando encodeURIComponent
    if (nombre && nombre.length >= 3) {
        params.fname = encodeURIComponent(nombre); // Codificar el valor del parámetro
    }
    if (tipo && tipo !== 'Tipo') {
        params.type = encodeURIComponent(tipo);
    }
    if (raza && raza !== 'Select Race') {
        params.race = encodeURIComponent(raza);
    }
    if (arquetipo && arquetipo !== 'Select archetype') {
        params.archetype = encodeURIComponent(arquetipo);
    }

    // Agregar los valores por defecto que siempre deben estar presentes
    params.num = 10;
    params.offset = 0;

    // Convertir el objeto params a una cadena de consulta (query string) usando URLSearchParams
    const queryString = Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join('&');

    // Redirigir a la nueva URL con los parámetros seleccionados
    console.log(queryString); // Verifica que los espacios se convierten en %20
    window.location.href = '?' + queryString;
}



// Eventos 'change' para los select
$(document).on('#tipo, #raza, #arquetipo').on('change', function() {
    handleFilters(); // Llamar a la función cuando cambie el valor de un select
});

// Evento 'input' para el campo de texto, con verificación de longitud mínima de 3 letras
$(document).on('#nombre').on('input', function() {
    if ($(this).val().length >= 3) {
        handleFilters(); // Llamar a la función solo cuando hay 3 o más letras
    }
});




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
        localStorage.setItem('shareId', elemento.id);

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

function agregarCarrito() {
    $(document).on("click", ".btn-cart", function(e) {
        e.stopPropagation(); // Detener la propagación del evento  
        let idOculto = $(this).data("info");
        let storedIds = JSON.parse(localStorage.getItem('carritoIds')) || []; // Recuperar o inicializar el array de IDs
        // Si el ID ya existe, removerlo del array
        if (storedIds.includes(idOculto)) {
            storedIds = storedIds.filter(id => id !== idOculto);
        }
        storedIds.push(idOculto);                                                // Agregar el ID al final del array
        //storedIds.unshift(idOculto);                                           //Agregar el ID al principio del array
        localStorage.setItem('carritoIds', JSON.stringify(storedIds));    // Guardar el array actualizado en localStorage
    });
}

// Función principal para inicializar la página
function initPage() {
    const { offset, limit, filters } = getParamsFromUrl();
    const pag = (offset / 10) + 1;
    
    loadHeaderAndFooter(); // Cargar el header y footer
    loadNavbar(filters);
    agregarCarrito();
    displayCardsAndPagination(offset, limit, pag); // Mostrar cartas y paginación
    handleImageClick(); // Manejar clicks en las imágenes
    handleOverlayClick(); // Manejar cierre del overlay
}


// Inicializar la página cuando el documento esté listo
$(document).ready(function() {
    initPage();
});


