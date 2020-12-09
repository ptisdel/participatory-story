import { useHistory } from 'react-router-dom';
import * as entities from '../../entities';
import * as helpers from '../../helpers';

const { useAuthentication } = helpers;
const { useStoryList } = entities.storyList.api;

export const useHomeView = () => {
  const history = useHistory();

  const { isLoading, stories } = useStoryList();
  const { user } = useAuthentication();

  const onCreateStory = () => history.push('/create-story');
  const onLogIn = () => history.push('/login');
  const onSelectStory = storyId => history.push(`/story/${storyId}`);
  
  return [{
    isAuthenticated: Boolean(user),
    isLoading,
    stories,
  }, {
    onCreateStory,
    onLogIn,
    onSelectStory,
  }];
}
