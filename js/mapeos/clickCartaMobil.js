export async function clickCartaMobil(id, url)
{
    return  `
            <div class="overlay">
                <div class="elemento">
                    <img class="img" src="${url}" alt="carta_api">
                </div>
            </div> 
            `
}    