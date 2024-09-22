export async function paginas(pag, ult) {
    let ultimaPagina = ult;
    let array = [];
    
    // Primera página (<<) y página anterior (<)
    if (pag > 1) {
        array.push(generateLink(0, "<<")); // Primera página
        array.push(generateLink(pag - 2, "<")); // Página anterior
    }

    // Páginas intermedias
    let startPage = Math.max(0, pag - 2);
    let endPage = Math.min(ultimaPagina, pag + 2);

    for (let i = startPage; i <= endPage; i++) {
        array.push(generateLink(i, i === pag - 1 ? `<strong>${i + 1}</strong>` : `${i + 1}`));
    }

    // Página siguiente (>) y última página (>>)
    if (pag < ultimaPagina) {
        array.push(generateLink(pag, ">")); // Página siguiente
        array.push(generateLink(ultimaPagina, ">>")); // Última página
    }
    
    return `
        <div class="pagination">
            ${array.join('')}
        </div>
    `;
}

// Función que genera un enlace de paginación
function generateLink(pageNumber, label) {
    let offset = pageNumber * 10;
    return `<a href="http://127.0.0.1:5500/html/buscarCartas.html?offset=${offset}&limit=10" class="paginationElement">${label}</a>`;
}
