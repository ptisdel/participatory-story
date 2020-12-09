import _ from 'lodash-es';
import moment from 'moment';
import React from 'react';
import { useStoryView } from './logic';
import { EntryPad } from './components';

export const StoryView = () => {
  const [{
    isLoading,
    isSubscribedToNotifications,
    entries,
    storyAuthorId,
    userId,
    userIsMember,
  }, {
    onJoinStory,
  }] = useStoryView();

  const userIsAuthor = (storyAuthorId === userId);
  const LoadingContent = () => (
    <div>Loading...</div>
  );

  const renderEntry = (entry, entryKey) => {
    const { authorId, timestamp, text, type } = entry;

    // TODO: differentiate between entry types (eg., section headers, paragraphs)

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

  const Content = () => (
    <div>
      { !userIsMember ? <div className='join-banner'><button onClick={onJoinStory}>Join this story</button></div> : null }
      { userIsAuthor ? <div className='author-banner'>You are writing this story.</div> : null }
      <div id='story-container'>
        { _.map(entries, (entry, entryKey) => renderEntry(entry, entryKey)) }
      </div>
    </div>    
  )

  return (
    <div>
      { isLoading
          ? <LoadingContent/>
          : <div>
              <Content/>
              { userIsMember ? <EntryPad/> : null }
            </div>
      }
    </div>
  );
}