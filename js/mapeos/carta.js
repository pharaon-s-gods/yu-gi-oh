export async function carta(id, url)
{
    return  `
            <div>
                <div class="img" id="${id}">
                    <img class="carta" src="${url}" alt="carta_api">
                    </div>
                <div class="button-container">
                    <button class="btn-buy">Comprar</button>
                    <button class="btn-cart">Agregar al carrito</button>
                </div>
            </div>
            `
}    