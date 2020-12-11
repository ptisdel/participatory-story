import _ from 'lodash-es';
import moment from 'moment';
import React from 'react';
import { useStoryView } from './logic';
import { AuthorEntryPad, PlayerEntryPad } from './components';

export const StoryView = () => {
  const [{
    isLoading,
    isSubscribedToNotifications,
    entries,
    storyName,
    userId,
    userIsAuthor,
    userIsPlayer,
  }, {
    onJoinStory,
  }] = useStoryView();

  const LoadingContent = () => (
    <div>Loading...</div>
  );

  const renderEntry = (entry, entryKey) => {
    const { authorId: entryAuthorId, authorName: entryAuthorName, timestamp, text, type } = entry;

    // TODO: differentiate between entry types (eg., section headers, paragraphs)

    const entryType = (() => {
      if (userIsAuthor && entryAuthorId !== userId) return 'playerEntry';
      if (userIsPlayer && entryAuthorId !== userId) return 'playerSelfEntry'
      return 'authorEntry';
    })();

    const timestampFormatted = moment(timestamp).fromNow();

    if (entryType === 'playerEntry') return (
      <div className='entry self-entry' key={entryKey}>
        <p><i className='fas fa-share self-entry-icon'></i> { text }</p>
        <div className='timestamp'>{_.upperCase(entryAuthorName)} responded {timestampFormatted}</div>
      </div>
    );

    if (entryType === 'playerSelfEntry') return (
      <div className='entry self-entry' key={entryKey}>
        <p><i className='fas fa-share self-entry-icon'></i> { text }</p>
        <div className='timestamp'>You responded {timestampFormatted}</div>
      </div>
    );

    if ('authorEntry') return (
      <div className='entry' key={entryKey}>
        <p>{ text }</p>
        <div className='timestamp'>{timestampFormatted}</div>
      </div>
    );

    return null;
  };

  const Header = () => (
    <div className='story-header'>
      <h1>{ storyName }</h1>
      <button className='story-options-button'><i className="fas fa-cog"></i></button>
    </div>
  );

  const AuthorContent = () => (
    <div id='author-story-container'>
      { _.map(entries, (entry, entryKey) => renderEntry(entry, entryKey)) }
    </div>
  );

  const PlayerContent = () => (
    <div id='player-story-container'>
      { _.map(entries, (entry, entryKey) => renderEntry(entry, entryKey)) }
    </div>
  );

  if (isLoading) return <LoadingContent/>;

  if (userIsAuthor) return (
    <div id='page-layout'>
        <div className='author-banner'>You are writing this story.</div>
        <Header/>
        <AuthorContent/>
        <AuthorEntryPad/>
    </div>
  )

  if (userIsPlayer) return (
    <div id='page-layout'>
        <Header/>
        <PlayerContent/>
        <PlayerEntryPad/>
    </div>
  )

  // user is non-member
  return (
    <div id='page-layout'>
        <div className='join-banner'><button onClick={onJoinStory}>Join this story</button></div>
        <Header/>
        <AuthorEntryPad/>
    </div>
  );
}