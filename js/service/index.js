import { home } from "../mapeos/home.js";
import { clickCartaMobil } from "../mapeos/clickCartaMobil.js";
import { carta } from "../mapeos/carta.js";
import { getAll } from "../fetchs/getAll.js";
import { footer } from "../mapeos/footer.js";
import { header } from "../mapeos/header.js";


$(document).ready(function() {
    // home().then(html => {
    //     $('#main').html(html);
    // });
    header().then( html => {
        $('header').append(html);
    });


    // carta().then(html => {
    //     $('#main').append(html);
    // });
    // carta().then(html => {
    //     $('#main').append(html);
    // });
    

    footer().then( html => {
        $('footer').append(html);
    });

    $(".img").click(function() {
        var srcImagen = $(this).find("img").attr("src");
        clickCartaMobil(srcImagen).then(html => {
            $('#main').append(html);
        });
    });

    $(document).mouseup(function(e) {
        var container = $(".elemento"); // El div interno que no debe cerrar
        // Si el clic fue fuera del div .elemento
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            $(".overlay").remove(); // Elimina el overlay y su contenido
        }
    });

    

    // getAll().then(response => {
    //     if (response.ok) {
    //         response.json().then(data => {
    //             console.log(data);
    //             console.log(data.data[0]);
    //             console.log(data.data[0].name);
    //             // Convertimos el objeto JSON a una cadena
    //             const jsonString = JSON.stringify(data);
    //             // Calculamos el tamaño en caracteres
    //             const tamañoEnCaracteres = jsonString.length;
    //             console.log("El tamaño aproximado del JSON en caracteres es:", tamañoEnCaracteres);
    //         });
    //     } else {
    //         console.error('Error fetching data:', response.statusText);
    //     }
    // }).catch(error => {
    //     console.error('Error fetching data:', error);
    // });
});