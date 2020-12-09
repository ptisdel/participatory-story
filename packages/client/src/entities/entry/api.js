import _ from 'lodash-es';
import { useEffect, useState } from 'react';
import { firebaseServices } from '../../services/firebase';
import { getAuthentication } from '../../helpers';

export async function create({ storyId, text, type = 'standard' }) {
    const { userToken } = await getAuthentication();
    if (!userToken) throw new Error('Not logged in! Cannot create entry.');

    const data = { text, type };

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

export const useEntries = ({ storyId }) => {
    const [entries, setEntries] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const onUpdate = updatedEntries => {
        setEntries(updatedEntries);
        setIsLoading(false);
    };

    useEffect(() => {
        if (!storyId) return;

        firebaseServices.entries.subscribe({ storyId, onUpdate });       
        return () => firebaseServices.entries.unsubscribe({ storyId });
    }, [storyId]);

    return {
        entries,
        isLoading,
    };
};
  