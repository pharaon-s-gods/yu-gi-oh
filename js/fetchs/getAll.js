export async function getAll() {
    let baseUrl = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';
    let urlParams = new URLSearchParams(window.location.search);

    let fname = urlParams.get('fanme') || '';
    let type = urlParams.get('type') || '';
    let race = urlParams.get('race') || '';
    let archetype = urlParams.get('archetype') || '';

    if ((fname !== '') || (type !== '') || (race !== '') || (archetype !== '')) {
        baseUrl = `${baseUrl}?`;
    }

    if (fname !== ''){
        baseUrl = `${baseUrl}&fname=${encodeURIComponent(fname)}`;
    }
    if (type !== ''){
        baseUrl = `${baseUrl}&type=${encodeURIComponent(type)}`;
    }
    if (race !== ''){
        baseUrl = `${baseUrl}&race=${encodeURIComponent(race)}`;
    }
    if (archetype !== ''){
        baseUrl = `${baseUrl}&archetype=${encodeURIComponent(archetype)}`;
    }
    
    const config = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const response = await fetch(baseUrl, config);
    return response;
}


