export async function paginas(pag, totalItems) {
    // Calcular la última página correctamente
    let ultimaPagina = Math.ceil(totalItems / 10) - 1;
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
        // Agrega la clase 'active' si la página actual es la misma que 'i'
        const isActive = i === pag - 1 ? 'activePage' : '';
        array.push(generateLink(i, `${i + 1}`, isActive));
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

// Función que genera un enlace de paginación, manteniendo los parámetros de la URL actual
function generateLink(pageNumber, label, activePage = '') {
    // Obtener los parámetros de la URL actual
    const urlParams = new URLSearchParams(window.location.search);
    
    // Actualizar el parámetro 'offset' según el número de página
    let offset = pageNumber * 10;
    urlParams.set('offset', offset);

    // Generar la nueva URL con los parámetros existentes
    let newUrl = `${window.location.pathname}?${urlParams.toString()}`;

    // Retornar el enlace con la clase 'active' si corresponde
    return `<a href="${newUrl}" class="paginationElement ${activePage}">${label}</a>`;
}
