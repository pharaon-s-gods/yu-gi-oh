import { footer } from "../mapeos/footer.js";
import { header } from "../mapeos/header.js";

// Cargar header y footer
function loadPage() {
    header().then(html => {
        document.getElementById("header").innerHTML = html;
        initMap(); // Inicializar mapa
    });
    footer().then(html => {
        document.getElementById("footer").innerHTML = html;
    });
}

// Inicializar el mapa de Leaflet
function initMap() {
    const map = L.map('map').setView([-34.921136, -57.954818], 15); // Coordenadas iniciales

    // Capa del mapa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Agregar marcador
    const marker = L.marker([-34.921136, -57.954818]).addTo(map);
    marker.bindPopup('<b>Yu-Gi-Oh! Store</b>').openPopup(); // Ventana emergente
}

// Inicializar la pagina
document.addEventListener("DOMContentLoaded", loadPage);
