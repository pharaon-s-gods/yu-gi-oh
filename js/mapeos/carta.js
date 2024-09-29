export async function carta(elemento)
{
    return  `
            <div class="contenedorItem">
                <div class="img" id="${elemento.id}" data-info='${JSON.stringify(elemento).replace(/'/g, '&apos;')}'>
                    <img class="carta" src="${elemento.card_images[0].image_url}" alt="carta_api">
                </div>
                <div class="quantity-container">
                    <button class="btn-quantity decrease" data-info="${elemento.id}">-</button>
                    <input type="text" id="quantity-${elemento.id}" class="quantity-input" value="1" readonly>
                    <button class="btn-quantity increase" data-info="${elemento.id}">+</button>
                </div>
                <div class="button-container">
                    <button class="btn-cart" data-info="${elemento.id}">Agregar al carrito</button>
                </div>
            </div>
            `
}    

//JSON.stringify(elemento)

//data-info="${JSON.stringify(elemento).replace(/'/g, '&apos;')}"