import { footer } from "../mapeos/footer.js";
import { header } from "../mapeos/header.js";

function loadPage() { // Carga el header y footer
    header().then(html => {
        $('header').append(html);
    });
    footer().then(html => {
        $('footer').append(html);
    });
}

loadPage();

const shareId = localStorage.getItem('shareId');
const cardTitleElement = document.getElementById('card-title');
const cardImageElement = document.getElementById('card-image');

fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${shareId}`)
    .then(response => response.json())
    .then(data => {
        if (data.data && data.data.length > 0) {
            const carta = data.data[0]; 
            cardTitleElement.textContent = carta.name; 
            cardImageElement.src = carta.card_images[0].image_url; 
            cardImageElement.style.display = 'block'; 
        } else {
            console.error('No se encontró la carta');
        }
    })
    .catch(error => console.error('Error fetching card data:', error));

function isValidEmail(email) { // Valida el formato de la direccion de correo
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    return emailPattern.test(email);
}

document.getElementById('share-form').addEventListener('submit', function (event) {
    event.preventDefault(); 
    const senderEmail = document.getElementById('sender-email').value;
    const recipientEmail = document.getElementById('recipient-email').value;
    const message = document.getElementById('message').value;

    if (!senderEmail || !recipientEmail) {
        alert('Por favor, completa todos los campos requeridos.');
        return;
    }

    if (!isValidEmail(senderEmail) || !isValidEmail(recipientEmail)) {
        alert('Por favor, introduce un correo electronico valido.');
        return;
    }

    const mailtoLink = `mailto:${recipientEmail}?subject=¡Mira esta carta de Yu-Gi-Oh!&body=${message} (Carta: ${cardTitleElement.textContent})`;
    window.location.href = mailtoLink; 
});
