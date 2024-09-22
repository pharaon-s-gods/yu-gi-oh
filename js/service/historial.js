document.addEventListener("DOMContentLoaded", () => {
    const cartasHistorialContainer = document.getElementById("cartas-historial");
    const pageInfo = document.getElementById("page-info");
    const prevButton = document.getElementById("prev-page");
    const nextButton = document.getElementById("next-page");

    const ITEMS_PER_PAGE = 10;
    let currentPage = 1;
    let cartasHistorial = JSON.parse(localStorage.getItem("cartasVisualizadasId")) || [];

    async function obtenerCartaPorId(id) {
        try {
            const respuesta = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${id}`);
            if (!respuesta.ok) throw new Error("Error al obtener la carta");
            const data = await respuesta.json();
            return data.data[0]; // Retorna la primera carta de la respuesta
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async function renderCartas() {
        cartasHistorialContainer.innerHTML = "";

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const cartasToShow = cartasHistorial.slice(startIndex, endIndex);

        const cartasPromises = cartasToShow.map(cartaId => obtenerCartaPorId(cartaId));
        const cartas = await Promise.all(cartasPromises);

        cartas.forEach(carta => {
            if (carta) {
                const cartaElement = document.createElement("div");
                cartaElement.className = "carta";
                cartaElement.innerHTML = `
                    <img src="${carta.card_images[0].image_url}" alt="${carta.name}">
                    <h3>${carta.name}</h3>
                `;
                cartasHistorialContainer.appendChild(cartaElement);
            }
        });

        pageInfo.textContent = `Página ${currentPage} de ${Math.ceil(cartasHistorial.length / ITEMS_PER_PAGE)}`;
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === Math.ceil(cartasHistorial.length / ITEMS_PER_PAGE);
    }

    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderCartas();
        }
    });

    nextButton.addEventListener("click", () => {
        if (currentPage < Math.ceil(cartasHistorial.length / ITEMS_PER_PAGE)) {
            currentPage++;
            renderCartas();
        }
    });

    renderCartas();
});

