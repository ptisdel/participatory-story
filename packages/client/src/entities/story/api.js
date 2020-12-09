import { useEffect, useState } from 'react';
import { firebaseServices } from '../../services/firebase';
import { getAuthentication } from '../../helpers';

export async function create({ description, name, playerCount }) {
    const { userToken } = await getAuthentication();
    if (!userToken) throw new Error('Not logged in! Cannot create story.');

    const data = { 
        description,
        name,
        playerCount,
    };

    const response = await fetch('http://localhost:3000/api/stories', {
        body: JSON.stringify(data),
        headers: {
            'Authorization': `Bearer ${userToken}`,
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
        method: 'POST',
    });
    const responseData = await response.json();
    return responseData?.storyId;
}

export async function join({ storyId }) {
    const { userToken } = await getAuthentication();
    if (!userToken) throw new Error('Not logged in! Cannot join story.');

    const data = { 
        action: 'add',
        storyId,
    };

    const response = await fetch(`http://localhost:3000/api/stories/${storyId}/players`, {
        body: JSON.stringify(data),
        headers: {
            'Authorization': `Bearer ${userToken}`,
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
        method: 'PATCH',
    });
    const responseData = await response.json();
    return responseData?.player;
}

export const useStory = ({ storyId }) => {
    const [story, setStory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const onUpdate = updatedStory => {
        setStory(updatedStory);
        setIsLoading(false);
    };

    useEffect(() => {
        if (!storyId) return;

        firebaseServices.story.subscribe({ storyId, onUpdate });       
        return () => firebaseServices.story.unsubscribe({ storyId });
    }, [storyId]);

    return {
        story,
        isLoading,
    };
};
  