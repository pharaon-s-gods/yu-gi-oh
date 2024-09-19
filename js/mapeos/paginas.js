export async function paginas(pag) {
    let ultimaPagina = 1343;
    let array = [10];
    
    
    if (pag == 1) {
        array[0] = generateLink(1);
        array[1] = generateLink(2);
        array[2] = generateLink(3);
        array[3] = generateLink(4);
        array[4] = generateLink(5);
        array[5] = generateLink(6);
        array[6] = `<a href="http://127.0.0.1:5500/html/?offset=${10}&limit=10" class="paginationElement">></a>`;
        array[7] = `<a href="http://127.0.0.1:5500/html/?offset=${(ultimaPagina - 1) * 10}&limit=10" class="paginationElement">>></a>`;
    }
    else {
        if ((pag > 1) && ((pag + 7) <= ultimaPagina)) {
            array[0] = `<a href="http://127.0.0.1:5500/html/?offset=0&limit=10" class="paginationElement"><<</a>`;
            array[1] = `<a href="http://127.0.0.1:5500/html/?offset=${(pag - 2) * 10}&limit=10" class="paginationElement"><</a>`;
            array[2] = generateLink(pag + 1);
            array[3] = generateLink(pag + 2);
            array[4] = generateLink(pag + 3);
            array[5] = generateLink(pag + 4);
            array[6] = `<a href="http://127.0.0.1:5500/html/?offset=${pag * 10}&limit=10" class="paginationElement">></a>`;
            array[7] = `<a href="http://127.0.0.1:5500/html/?offset=${(ultimaPagina - 1) * 10}&limit=10" class="paginationElement">>></a>`;
        } else {
            array[0] = `<a href="http://127.0.0.1:5500/html/?offset=0&limit=10" class="paginationElement"><<</a>`;
            array[1] = `<a href="http://127.0.0.1:5500/html/?offset=${(pag - 2) * 10}&limit=10" class="paginationElement"><</a>`;
            array[2] = generateLink(1338);
            array[3] = generateLink(1339);
            array[4] = generateLink(1340);
            array[5] = generateLink(1341);
            array[6] = generateLink(1342);
            array[7] = generateLink(1343);
        }
    }
    
    return  `
            <div class="pagination">
                ${array[0]}
                ${array[1]}
                ${array[2]}
                ${array[3]}
                ${array[4]}
                ${array[5]}
                ${array[6]}
                ${array[7]}
            </div>
            `;
}



// Calcula el offset para una página específica
function generateLink(pageNumber) {
    let offset = (pageNumber - 1) * 10;
    return `<a href="http://127.0.0.1:5500/html/?offset=${offset}&limit=10" class="paginationElement">${pageNumber}</a>`;
}
