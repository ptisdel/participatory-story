import { useEffect, useState } from 'react';
import { firebaseServices } from '../../services/firebase';

export const useStoryList = () => {
    const [stories, setStories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        firebaseServices.storyList.subscribe(updatedStories => {
            setStories(updatedStories);
            setIsLoading(false);
        });
        return firebaseServices.storyList.unsubscribe;
    }, []);

    return { isLoading, stories };
};
  