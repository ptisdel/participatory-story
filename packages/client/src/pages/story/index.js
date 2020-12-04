import _ from 'lodash-es';
import moment from 'moment';
import React from 'react';
import { useStory } from './logic';


export const StoryPage = () => {
  const [{
    error,
    inputValue,
    isSubscribedToNotifications,
    story,
    storyAuthorId,
    userId
  }, {
    onClear, 
    onInputValueChange,
    onSubmit
  }] = useStory();

  const renderEntry = (entry, entryKey) => {
    const { authorId, timestamp, text } = entry;

    const isSelfEntry = authorId === userId;
    const isStoryEntry = authorId === storyAuthorId;

    const timestampFormatted = moment(timestamp).fromNow();

    if (isSelfEntry) return (
      <div className='entry self-entry' key={entryKey}>
        <p><i className='fas fa-share self-entry-icon'></i> { text }</p>
        <div className='timestamp'>You responded {timestampFormatted}</div>
      </div>
    );

    if (isStoryEntry) return (
      <div className='entry' key={entryKey}>
        <p>{ text }</p>
        <div className='timestamp'>{timestampFormatted}</div>
      </div>
    );

    return null;
  };

  const renderSection = (section, sectionKey) => {
      return (
        <div className='section' key={sectionKey}>
          <h2>{section.name}</h2>
          { _.map(section.entries, (entry, entryKey) => renderEntry(entry, entryKey)) }
        </div>
      );
  };

  return (
    <div id='story-container'>
      { isSubscribedToNotifications ? 'yes' : 'no'}
      { _.map(story, (section, sectionKey) => renderSection(section, sectionKey)) }
      { error ? <p id='error'>{error}</p> : null }
      <form id='entrypad' onSubmit={onSubmit}>
        <div id='input-field-wrapper'>
          <input id='input-field' placeholder='Type your request here' onChange={onInputValueChange} value={inputValue} ></input>
          <button className={ (inputValue !== '') ? 'visible' : ''} id='input-field-clear-button' onClick={onClear}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <button className={ (inputValue !== '') ? 'active' : ''} id='submit-button' type='submit'>  
          <i className='fab fa-telegram-plane' id='submit-button-icon'></i>
        </button>  
        {/* <input id='submitButton' type='submit' value='Submit'></input> */}
      </form>
    </div>
  );
}