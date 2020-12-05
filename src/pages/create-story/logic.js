import _ from 'lodash-es';
import { getIsAuthenticated, getUserId } from '../../helpers';
import { createStory } from '../../services/firebase';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
export const useCreateStoryPage = () => {

  // name and description
  const [storyName, setStoryName] = useState('');
  const [storyDescription, setStoryDescription] = useState('');

  const onChangeStoryName = e => {
    setStoryName(e.target.value);
  };
  
  const onChangeStoryDescription = e => {
    setStoryDescription(e.target.value);
  };

  // player count
  const [playerCount, setPlayerCount] = useState(3);
  const minPlayerCount = 2;
  const maxPlayerCount = 5; 
  const playerCountOptions = _.range(minPlayerCount, maxPlayerCount + 1);
  const onSelectPlayerCount = playerCount => {
    setPlayerCount(playerCount);
  };

  // submit form
  const history = useHistory();
  const onSubmit = e => {
    e.preventDefault();

    const onStoryCreated = ({ storyId }) => {
      if (storyId) {
        history.push(`/story/${storyId}`);
      } else {
        console.log('Story not created.');
      }
    };

    const trimmedStoryName = _.trim(storyName);
    const trimmedStoryDescription = _.trim(storyDescription);

    if (trimmedStoryName !== '' && trimmedStoryDescription !== '' && playerCount) {
      createStory({
        callback: onStoryCreated,
        name: trimmedStoryName,
        description: trimmedStoryDescription,
        playerCount,
      });
    }
  }

  return [{
    playerCount,
    playerCountOptions,
    storyDescription,
    storyName,
  }, {
    onChangeStoryName,
    onChangeStoryDescription,
    onSelectPlayerCount,
    onSubmit,
  }];
}
