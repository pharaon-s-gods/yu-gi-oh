export async function getCard(offset, limit){
    const config = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    try 
    {
        const response = await fetch
        (
            `https://db.ygoprodeck.com/api/v7/cardinfo.php?offset=${offset}&num=${limit}`, config
        );
        return response;
    }
    catch (error) 
    {
        console.log(error);
    }
}