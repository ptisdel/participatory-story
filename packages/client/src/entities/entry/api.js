import { getAuthentication } from '../../helpers';

create.queryKey = 'createEntry';
export async function create({ storyId, text }) {
    const { userToken } = await getAuthentication();
    if (!userToken) throw new Error('Not logged in! Cannot create entry.');

    const data = { text };

    const response = await fetch(`http://localhost:3000/api/stories/${storyId}/entries`, {
        body: JSON.stringify(data),
        headers: {
            'Authorization': `Bearer ${userToken}`,
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
        method: 'POST',
    });
    const responseData = await response.json();
    return responseData?.entryId;
}
