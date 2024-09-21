export async function carta(elemento)
{
    return  `
            <div>
                <div class="img" id="${elemento.id}" data-info='${JSON.stringify(elemento).replace(/'/g, '&apos;')}'>
                    <img class="carta" src="${elemento.card_images[0].image_url}" alt="carta_api">
                </div>
                <div class="button-container">
                    <button class="btn-buy">Comprar</button>
                    <button class="btn-cart">Agregar al carrito</button>
                </div>
            </div>
            `
}    

//JSON.stringify(elemento)

//data-info="${JSON.stringify(elemento).replace(/'/g, '&apos;')}"