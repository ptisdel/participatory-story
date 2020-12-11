import _ from 'lodash-es';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from 'react-query';
import * as entities from '../../../../entities';

const { create } = entities.story.api;

export const useCreateStoryForm = () => {
  // name and description
  const [storyName, setStoryName] = useState('');
  const [storyDescription, setStoryDescription] = useState('');
  const onChangeStoryName = e => setStoryName(e.target.value);
  const onChangeStoryDescription = e => setStoryDescription(e.target.value);

  // player count
  const [playerCount, setPlayerCount] = useState(3);
  const minPlayerCount = 2;
  const maxPlayerCount = 5; 
  const playerCountOptions = _.range(minPlayerCount, maxPlayerCount + 1);
  const onSelectPlayerCount = playerCount => setPlayerCount(playerCount);

  // create story
  const history = useHistory();
  const [createStory, { isLoading }] = useMutation(create, {
    onError: () => console.log('Oops!'),
    onSuccess: storyId => {
      if (storyId) history.push(`/story/${storyId}`);
    },
  });

  // submit form
  const onSubmit = e => {
    e.preventDefault();

    const trimmedStoryName = _.trim(storyName);
    const trimmedStoryDescription = _.trim(storyDescription);

    if (trimmedStoryName !== '' && trimmedStoryDescription !== '' && playerCount) {
      createStory({
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
