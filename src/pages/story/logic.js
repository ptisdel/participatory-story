import _ from 'lodash-es';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserId } from '../../helpers';
import { subscribeToStoryChanges, submitRequest } from '../../services/firebase';

export const useStory = () => {
  const { storyId } = useParams();

  // fetch story
  const [story, setStory] = useState([]);
  const [storyAuthorId, setStoryAuthorId] = useState(null);
  const [currentSection, setCurrentSection] = useState(null);
  const [isSubscribedToNotifications, setIsSubscribedToNotifications] = useState(false);
  const userId = getUserId();

  const updateStory = ({ authorId, currentSection, sections,}) => {
    setCurrentSection(currentSection);
    setStory(sections);
    setStoryAuthorId(authorId);
  }

  const onSubscribeToNotifications = ({ didSucceed }) => {
    setIsSubscribedToNotifications(didSucceed);
  }

  useEffect(() => {
    if (storyId === null) return;

    const { unsubscribe } = subscribeToStoryChanges({
      storyId,
      onUpdate: updateStory,
      onSubscribeToNotifications,
    });

    return unsubscribe;
  }, [storyId]);

  // input functions
  const onClear = () => {
    setInputValue('');
  }

  const [inputValue, setInputValue] = useState('');
  const onInputValueChange = (e) => setInputValue(e.target.value)
  const [error, setError] = useState(null);

  const onSubmit = async e => {
    e.preventDefault();
    if (inputValue !== '') {
      submitRequest({ currentSection, storyId, text: inputValue });
      setInputValue('');
      setError(null);      
    }
  };

  return [{
    error,
    inputValue,
    isSubscribedToNotifications,
    story,
    storyAuthorId,
    userId,
  }, {
    onClear,
    onInputValueChange,
    onSubmit,
  }];
}
