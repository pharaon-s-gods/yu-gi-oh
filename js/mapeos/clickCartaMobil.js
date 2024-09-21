export async function clickCartaMobil(elemento)
{
    return  `
            <div class="overlay">
                <a href="https://www.example.com" class="share-icon">
                    <img src="../../img/shareIcon.png" alt="Compartir">
                </a>
                <div class="elemento">
                    <img class="img" src="${elemento.card_images[0].image_url}" alt="carta_api">
                </div>
                <div class="detalle">
                    <div class="tituloDetalle">
                        <h3>${elemento.name}</h3>
                    </div>
                    <div class="descripcionDetalle">
                        <p>${elemento.desc}</p>
                    </div>
                </div>
            </div> 
            `
}