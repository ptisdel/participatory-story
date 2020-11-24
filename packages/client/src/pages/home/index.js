import _ from 'lodash-es';
import React from 'react';
import { useHomePage } from './logic';

export const HomePage = () => {
  const [{
    isAuthenticated,
    stories,
  }, {
    onCreateStory,
    onLogIn,
    onSelectStory,
  }] = useHomePage();

  const LoginContent = () => (
    <div id='log-in-content'>
      <button onClick={onLogIn}>Log In</button>
      <div>to browse games.</div>
    </div>
  );
  
  const StoriesContent = () => (
    <>
        <h1>Join a Story</h1>
        {
          (stories.length === 0) ? <p>No stories are available.</p> : null
        }
        <div id='story-list'>
          { 
            _.map(stories, (story, i) => 
              <>
                <div className='story' key={i} onClick={() => onSelectStory(story.id)}>   
                  <div className='story-main-info'>
                    <div className ='story-icon-circle'>
                      <i className='fas fa-book story-icon'></i>
                    </div>
                    <div>
                      <div className='story-title'>{story.name}</div>
                      <div className='story-description'>{story.description}</div>
                    </div>
                  </div>
                  <div className='story-meta-info'>
                    {/* <div className='story-attribution'>By</div> */}
                    <div className='story-author'>{story.author.name}</div>
                  </div>
                </div>
                { (i < stories.length - 1) ? <div class='story-divider'></div> : null }
              </>
            )
          }
        </div>
        <button id='new-story-button' onClick={onCreateStory}>
          <i className="fas fa-pencil-alt"></i>
        </button>
      </>
    );

  return (
    <div id='page-layout'>
      { !isAuthenticated && <LoginContent/> }
      { isAuthenticated && <StoriesContent/> }
    </div>
  );
}