// Suponiendo que el ID de la carta se guarda en localStorage como "shareId"
const shareId = localStorage.getItem('shareId');
const cardTitleElement = document.getElementById('card-title');

// Aquí deberías hacer un fetch para obtener los detalles de la carta usando el shareId
fetch(`https://api.yugioh.com/cards/${shareId}`)
    .then(response => response.json())
    .then(data => {
        // Asumiendo que el título de la carta está en data.title
        cardTitleElement.value = data.title; // Coloca el título en el campo correspondiente
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
    const mailtoLink = `mailto:${recipientEmail}?subject=¡Mira esta carta de Yu-Gi-Oh!&body=${message} (Carta: ${cardTitleElement.value})`;
    window.location.href = mailtoLink; // Abrir el gestor de correo
});
