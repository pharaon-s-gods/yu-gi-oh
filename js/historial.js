document.addEventListener("DOMContentLoaded", () => {
    const cartasHistorialContainer = document.getElementById("cartas-historial");
    const pageInfo = document.getElementById("page-info");
    const prevButton = document.getElementById("prev-page");
    const nextButton = document.getElementById("next-page");

    const ITEMS_PER_PAGE = 10;
    let currentPage = 1;
    let cartasHistorial = JSON.parse(localStorage.getItem("cartasVisitadas")) || [];
    
    function renderCartas() {
        cartasHistorialContainer.innerHTML = "";
        
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const cartasToShow = cartasHistorial.slice(startIndex, endIndex);
        
        cartasToShow.forEach(carta => {
            const cartaElement = document.createElement("div");
            cartaElement.className = "carta";
            cartaElement.innerHTML = `
                <img src="https://example.com/api/${carta.id}/image" alt="${carta.name}">
                <h3>${carta.name}</h3>
            `;
            cartasHistorialContainer.appendChild(cartaElement);
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
