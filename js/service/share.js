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
            cardTitleElement.value = carta.name; // Asignar el nombre de la carta al campo
            cardImageElement.src = carta.card_images[0].image_url; 
            cardImageElement.style.display = 'block'; 
        } else {
            console.error('No se encontró la carta');
        }
    })
    .catch(error => console.error('Error fetching card data:', error));

function isValidEmail(email) { // Valida el correo
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    return emailPattern.test(email);
}

document.getElementById('share-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const senderEmail = document.getElementById('sender-email').value;
    const recipientEmail = document.getElementById('recipient-email').value;
    const message = document.getElementById('message').value.trim(); // Mensaje opcional

    if (!senderEmail || !recipientEmail) {
        alert('Por favor, completá ambos correos.');
        return;
    }

    if (!isValidEmail(senderEmail) || !isValidEmail(recipientEmail)) {
        alert('Por favor, introducí correos electrónicos válido.');
        return;
    }

    // URL de la imagen de la carta
    const cardImageUrl = cardImageElement.src;

    // Crear el cuerpo del mensaje
    let bodyMessage;
    if (message) {
        bodyMessage = `${message}\n\nAcá está la imagen:\n${cardImageUrl}\n\nCompartido por: ${senderEmail}\n\nCompartido de Yu-Gi-Oh! Store: https://yugiohstore.com`;
    } else {
        bodyMessage = `Te comparto una carta:\n\nAcá está la imagen:\n${cardImageUrl}\nCompartido por: ${senderEmail}\n\nCompartido de Yu-Gi-Oh! Store: https://yugiohstore.com`;
    }

    const mailtoLink = `mailto:${recipientEmail}?subject=Te comparto esta carta de Yu-Gi-Oh!&body=${encodeURIComponent(bodyMessage)}`;

    window.location.href = mailtoLink; 
});
