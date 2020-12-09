import _ from 'lodash-es';
import moment from 'moment';
import React from 'react';
import { useStoryView } from './logic';
import { EntryPad } from './components';

export const StoryView = () => {
  const [{
    inputValue,
    isLoading,
    isSubscribedToNotifications,
    sections,
    storyAuthorId,
    userId,
  }, {
    onClear, 
    onInputValueChange,
    onSubmit,
  }] = useStoryView();

  const LoadingContent = () => (
    <div>Loading...</div>
  );

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

  const Content = () => (
    <div>
  return (
      <div id='story-container'>
        { _.map(sections, (section, sectionKey) => renderSection(section, sectionKey)) }
      </div>
    </div>    
  )

  return (
    <div>
      { isLoading
          ? <LoadingContent/>
          : <div>
              <Content/>
              <EntryPad/>
            </div>
      }
    </div>
  );
}