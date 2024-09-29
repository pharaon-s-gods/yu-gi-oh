export async function clickCartaMobil(elemento)
{
    return  `
            <div class="overlay">
                <a href="../../html/share.html" class="share-icon">
                    <img src="../../img/shareIcon.png" alt="Compartir">
                </a>
                <div class="elemento">
                    <img class="imgOverlay" src="${elemento.card_images[0].image_url}" alt="carta_api">
                </div>
                <div class="detalle">
                    <div class="tituloDetalle">
                        <h3>${elemento.name}</h3>
                    </div>
                    <div class="descripcionDetalle">
                        <p>t${elemento.desc}</p>
                    </div>
                    <div class="adicionalDetalle">
                        <span>Tipo: </span>
                        <h3>${elemento.type}</h3>
                    </div>
                    <div class="adicionalDetalle">
                        <span>Raza: </span>    
                        <h3>${elemento.race}</h3>
                    </div>
                    <div class="adicionalDetalle">
                        <span>Arquetipo: </span>
                        <h3>${elemento.archetype}</h3>
                    </div>
                    <div class="precioDetalle">
                        <h3>Precios</h3>
                        <div class="precios">
                            <div>
                                <span>Mercado de cartas</span>
                                <p>: ${elemento.card_prices[0].cardmarket_price}$</p>
                            </div>
                            <div>
                                <span>Jugador TCG</span>
                                <p>: ${elemento.card_prices[0].tcgplayer_price}$</p>
                            </div>
                            <div>
                                <span>Ebay</span>
                                <p>: ${elemento.card_prices[0].ebay_price}$</p>
                            </div>
                            <div>
                                <span>Amazon</span>
                                <p>: ${elemento.card_prices[0].amazon_price}$</p>
                            </div>
                            <div>
                                <span>Coolstuffic</span>
                                <p>: ${elemento.card_prices[0].coolstuffinc_price}$</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
            `
}