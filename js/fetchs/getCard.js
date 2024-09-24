export async function getCard(offset, limit) {
    let baseUrl = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';
    let urlParams = new URLSearchParams(window.location.search);

    // Corregir el nombre del parámetro
    let fname = urlParams.get('fname') || '';  // Estaba como 'fanme'
    let type = urlParams.get('type') || '';
    let race = urlParams.get('race') || '';
    let archetype = urlParams.get('archetype') || '';

    baseUrl = `${baseUrl}?`;

    // Añadir parámetros si existen
    if (fname !== '') {
        baseUrl = `${baseUrl}&fname=${encodeURIComponent(fname)}`;
    }
    if (type !== '') {
        baseUrl = `${baseUrl}&type=${encodeURIComponent(type)}`;
    }
    if (race !== '') {
        baseUrl = `${baseUrl}&race=${encodeURIComponent(race)}`;
    }
    if (archetype !== '') {
        baseUrl = `${baseUrl}&archetype=${encodeURIComponent(archetype)}`;
    }

    // Configuración para la petición GET
    const config = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    try {
        // Realizar la solicitud con fetch
        const response = await fetch(`${baseUrl}&offset=${offset}&num=${limit}`, config);
        // Si la respuesta no es OK (200-299), lanzar un error
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;  // Devolver la respuesta si todo va bien
    } catch (error) {
        throw error;  // Puedes relanzar el error o manejarlo según sea necesario
    }
}
