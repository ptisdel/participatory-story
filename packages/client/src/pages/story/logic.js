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
  const userId = getUserId();

  const updateStory = ({ authorId, currentSection, sections,}) => {
    setCurrentSection(currentSection);
    setStory(sections);
    setStoryAuthorId(authorId);
  }

  useEffect(() => {
    if (storyId === null) return;

    const { unsubscribe } = subscribeToStoryChanges({ storyId, onUpdate: updateStory })

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
      await submitRequest({ currentSection, storyId, text: inputValue })
        .then(() => {
          setInputValue('');
          setError(null);
        })
        .catch(err => {
          setError(`Error ${err.code}: ${err.message}`);
        });
    }
  };

  return [{
    error,
    inputValue,
    story,
    storyAuthorId,
    userId,
  }, {
    onClear,
    onInputValueChange,
    onSubmit,
  }];
}
