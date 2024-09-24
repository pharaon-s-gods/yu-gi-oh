export async function getArchetypes(){
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
            `https://db.ygoprodeck.com/api/v7/archetypes.php`, config
        );
        return response;
    }
    catch (error) 
    {
        console.log(error);
    }
}