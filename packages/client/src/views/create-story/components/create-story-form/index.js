import _ from 'lodash-es';
import React from 'react';
import { useCreateStoryForm } from './logic';

export const CreateStoryForm = () => {
    const [{
        isLoading,
        playerCount,
        playerCountOptions,
        storyDescription,
        storyName,
      }, {
        onChangeStoryDescription,
        onChangeStoryName,
        onSelectPlayerCount,
        onSubmit,
      }] = useCreateStoryForm();
    
    return (
            isLoading
                ? <div>Loading...</div>
                : ( 
                    <form onSubmit={onSubmit}>
                        <h1>Create a Story</h1>
                        <input id='story-name-field' name='Name' onChange={onChangeStoryName} placeholder='Name' type='text' value={storyName}/>
                        <input id='story-description-field' name='Description' onChange={onChangeStoryDescription} placeholder='Description' type='text' value={storyDescription}/>
                        <div id='player-count-options'>
                        <div id ='player-count-options-label'>Player Count:</div> 
                        { 
                            _.map(playerCountOptions, n => (
                            <div
                                className={ playerCount === n ? 'player-count-option selected' : 'player-count-option' }
                                key={n}
                                onClick={() => onSelectPlayerCount(n)}
                            >{ n }</div>
                            ))
                        }
                        </div>
                        <button type='submit'>Create Story</button>
                    </form>
                )
    )
}
