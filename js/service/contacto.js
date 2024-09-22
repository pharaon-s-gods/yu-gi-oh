import { footer } from "../mapeos/footer.js";
import { header } from "../mapeos/header.js";

// Función para cargar el header y el footer
function loadPage() {
    header().then(html => {
        document.getElementById("header").innerHTML = html;
    });
    footer().then(html => {
        document.getElementById("footer").innerHTML = html;
    });
}

// Inicializar la página
document.addEventListener("DOMContentLoaded", loadPage);
