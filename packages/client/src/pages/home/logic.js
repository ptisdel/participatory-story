import { getIsAuthenticated, getUserId } from '../../helpers';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { registerStoryListUpdates, cleanUpStoryListUpdate, registerUserForNotifications } from '../../services/firebase';

export const useHomePage = () => {
  const history = useHistory();
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    registerStoryListUpdates((stories) => setStories(stories));
    return cleanUpStoryListUpdate;
  }, []);

  const onCreateStory = () => {
    // TODO: add functionality
  };

  const onLogIn = () => {
    history.push('/login');
  }

  const onSelectStory = storyId => {
    history.push(`/story/${storyId}`);
  }
  
  return [{
    stories,
    isAuthenticated: getIsAuthenticated(),
  }, {
    onCreateStory,
    onLogIn,
    onSelectStory,
  }];
}
