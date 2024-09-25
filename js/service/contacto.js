import { footer } from "../mapeos/footer.js";
import { header } from "../mapeos/header.js";

// Función para cargar el header y el footer
function loadPage() {
    header().then(html => {
        document.getElementById("header").innerHTML = html;
        
        // Inicializar el mapa solo después de cargar el header
        initMap();
    });
    footer().then(html => {
        document.getElementById("footer").innerHTML = html;
    });
}

// Inicializar el mapa de Leaflet
function initMap() {
    const map = L.map('map').setView([-34.921136, -57.954818], 15); // Coordenadas de la Catedral de La Plata

    // Agregar una capa de mapa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Agregar un marcador
    const marker = L.marker([-34.921136, -57.954818]).addTo(map);
    marker.bindPopup('<b>Yu-Gi-Oh! Store</b>').openPopup(); // Pop-up con el nombre de la tienda
}

// Inicializar la página
document.addEventListener("DOMContentLoaded", loadPage);
