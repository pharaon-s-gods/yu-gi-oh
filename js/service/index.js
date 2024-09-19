import { home } from "../mapeos/home.js";
import { clickCartaMobil } from "../mapeos/clickCartaMobil.js";
import { carta } from "../mapeos/carta.js";
import { getCard } from "../fetchs/getCard.js";
import { footer } from "../mapeos/footer.js";
import { header } from "../mapeos/header.js";
import { paginas } from "../mapeos/paginas.js";

// let offset = 0;
// let limit = 10;
// let isOverlayActive = false;


// Función para extraer parámetros de la URL
function getParamsFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    let offset = urlParams.get('offset') || 0;
    let limit = urlParams.get('limit') || 10;
    // Convertir a enteros para su uso posterior
    offset = parseInt(offset);
    limit = parseInt(limit);
    // Filtrar otros parámetros (si es necesario)
    let filters = {};
    urlParams.forEach((value, key) => {
        if (key !== 'offset' && key !== 'num') {
            filters[key] = value;
        }
    });
    return { offset, limit, filters };
}



$(document).ready(function() {
    $(document).off("click", ".img");
    header().then( html => {
        $('header').append(html);
    });
    // home().then(html => {
    //     $('#main').append(html);
    // });
    footer().then( html => {
        $('footer').append(html);
    });

    // Obtener los parámetros de la URL
    let { offset, limit, filters } = getParamsFromUrl();
    let pag = (offset / 10) + 1;
    let isOverlayActive = false;

    getCard(offset, limit).then(response => {
        if (response.ok) {
            response.json().then(data => {
                //mapeo las cartas
                for (let i = 0; i < 10; i++) {
                    carta(data.data[i].id, data.data[i].card_images[0].image_url).then(html => {
                        $('#main').append(html);
                    });
                }
                paginas(pag).then(html => {
                    console.log(html);
                    $('#main').append(html);
                })
            });
        } else {
            console.error('Error fetching data:', response.statusText);
        }
    }).catch(error => {
        console.error('Error fetching data:', error);
    });


    // Registrar el nuevo manejador de eventos para .img
    $(document).on("click", ".img", function(e) {
        if (isOverlayActive) 
            return; // No hacer nada si el overlay está activo
        e.stopPropagation(); // Detener la propagación del evento
        var srcImagen = $(this).find("img.carta").attr("src");
        var id = $(this).parent().attr("id");
        // Activar el estado de overlay
        isOverlayActive = true;
        clickCartaMobil(id, srcImagen).then(html => {
            $('#main').append(html);
        });
    });

    
    // Manejar el clic fuera del overlay
    $(document).on("mouseup", function(e) {
        if (isOverlayActive) {
            var container = $(".elemento"); // El div interno que no debe cerrar si el clic fue fuera del div .elemento
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                $(".overlay").remove(); // Elimina el overlay y su contenido
                // Desactivar el estado de overlay
                isOverlayActive = false;
            }
        }
    });


});



