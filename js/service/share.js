import { footer } from "../mapeos/footer.js";
import { header } from "../mapeos/header.js";

// Función para cargar header y footer
function loadPage() {
    header().then(html => {
        $('#header').append(html);
    });
    footer().then(html => {
        $('#footer').append(html);
    });
}

// Ejecutar la función de carga de la página
loadPage();

// Suponiendo que el ID de la carta se guarda en localStorage como "shareId"
const shareId = localStorage.getItem('shareId');
const cardTitleElement = document.getElementById('card-title');
const cardImageElement = document.getElementById('card-image');

// Aquí deberías hacer un fetch para obtener los detalles de la carta usando el shareId
fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${shareId}`)
    .then(response => response.json())
    .then(data => {
        if (data.data && data.data.length > 0) {
            const carta = data.data[0]; // Asumiendo que el primer objeto contiene la carta
            cardTitleElement.textContent = carta.name; // Mostrar el título
            cardImageElement.src = carta.card_images[0].image_url; // Mostrar la imagen de la carta
            cardImageElement.style.display = 'block'; // Asegurarse de que la imagen sea visible
        } else {
            console.error('No se encontró la carta');
        }
    })
    .catch(error => console.error('Error fetching card data:', error));

// Función para validar el formato de un correo electrónico
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar correos
    return emailPattern.test(email);
}

// Manejo del formulario
document.getElementById('share-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar el envío normal del formulario
    const senderEmail = document.getElementById('sender-email').value;
    const recipientEmail = document.getElementById('recipient-email').value;
    const message = document.getElementById('message').value;

    // Validaciones simples
    if (!senderEmail || !recipientEmail) {
        alert('Por favor, completa todos los campos requeridos.');
        return;
    }

    if (!isValidEmail(senderEmail) || !isValidEmail(recipientEmail)) {
        alert('Por favor, introduce un correo electrónico válido.');
        return;
    }

    // Crear el enlace de correo
    const mailtoLink = `mailto:${recipientEmail}?subject=¡Mira esta carta de Yu-Gi-Oh!&body=${message} (Carta: ${cardTitleElement.textContent})`;
    window.location.href = mailtoLink; // Abrir el gestor de correo
});
