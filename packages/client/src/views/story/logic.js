import _ from 'lodash-es';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import * as entities from '../../entities';
import * as helpers from '../../helpers';

const { useAuthentication } = helpers;
const { useStory } = entities.story.api;

export const useStoryView = () => {
  const { storyId } = useParams();

  // fetch story
  const { isLoading, story } = useStory({ storyId });

  // get notification settings
  const [isSubscribedToNotifications, setIsSubscribedToNotifications] = useState(false);
  const user = useAuthentication();

  // input functions
  const onClear = () => {
    setInputValue('');
  }

  // form state
  const [inputValue, setInputValue] = useState('');
  const onInputValueChange = (e) => setInputValue(e.target.value)
  const [error, setError] = useState(null);

  // submit form
  const onSubmit = async e => {
    e.preventDefault();
    if (inputValue !== '') {
      submitRequest({ storyId, text: inputValue });
      setInputValue('');
      setError(null);      
    }
  };

  return [{
    error,
    inputValue,
    isLoading,
    isSubscribedToNotifications,
    sections: story?.sections,
    storyAuthorId: story?.authorId,
    userId: user?.userId,
  }, {
    onClear,
    onInputValueChange,
    onSubmit,
  }];
}
