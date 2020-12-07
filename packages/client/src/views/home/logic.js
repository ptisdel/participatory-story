import { getIsAuthenticated } from '../../helpers';
import { useHistory } from 'react-router-dom';
import * as entities from '../../entities';

const { useStoryList } = entities.storyList.api;

export const useHomeView = () => {
  const history = useHistory();

  const { isLoading, stories } = useStoryList();

  const onCreateStory = () => {
    history.push('/create-story');
  };

  const onLogIn = () => {
    history.push('/login');
  }

  const onSelectStory = storyId => {
    history.push(`/story/${storyId}`);
  }
  
  return [{
    isAuthenticated: getIsAuthenticated(),
    isLoading,
    stories,
  }, {
    onCreateStory,
    onLogIn,
    onSelectStory,
  }];
}
