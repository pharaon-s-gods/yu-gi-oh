export async function getAll(){
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
            `https://db.ygoprodeck.com/api/v7/cardinfo.php`, config
        );
        return response;
    }
    catch (error) 
    {
        console.log(error);
    }
}