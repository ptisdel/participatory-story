import { getIsAuthenticated } from '../../helpers';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { onStoryListUpdate, cleanUpStoryListUpdate } from '../../services/firebase';

export const useHomePage = () => {
  const history = useHistory();
  const [stories, setStories] = useState([]);

  useEffect(() => {
    onStoryListUpdate((stories) => setStories(stories));  
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
