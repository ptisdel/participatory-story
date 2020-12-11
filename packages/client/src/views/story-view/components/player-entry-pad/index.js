import _ from 'lodash-es';
import React from 'react';

import { usePlayerEntryPad } from './logic';

export const PlayerEntryPad = () => {

    const [data, handlers] = usePlayerEntryPad();

    return (
        <form id='entrypad' onSubmit={handlers.onSubmit}>
            <div id='input-field-wrapper'>
                <input id='input-field' placeholder='Type your request here' onChange={handlers.onInputValueChange} value={data.inputValue} ></input>
                <button className={ (_.trim(data.inputValue) !== '') ? 'visible' : ''} id='input-field-clear-button' onClick={handlers.onClear}>
                    <i className="fas fa-times"></i>
                </button>
            </div>
            <button className={ (data.inputValue !== '') ? 'active' : ''} id='submit-button' type='submit'>  
                <i className='fab fa-telegram-plane' id='submit-button-icon'></i>
            </button>
        </form>
    );
}