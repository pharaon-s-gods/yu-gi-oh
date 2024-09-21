import { home } from "../mapeos/home.js";
import { footer } from "../mapeos/footer.js";
import { header } from "../mapeos/header.js";
// Función para cargar header y footer
function loadpage() {
    header().then(html => $('header').append(html));
    home().then(html => $('main').append(html));
    footer().then(html => $('footer').append(html));
}

// Función principal para inicializar la página
function initPage() {
    loadpage(); // Cargar el header y footer
}

// Inicializar la página cuando el documento esté listo
$(document).ready(function() {
    initPage();
});


