import _ from 'lodash-es';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useParams } from 'react-router-dom';
import * as entities from '../../../../entities';

const { create } = entities.entry.api;

export const usePlayerEntryPad = () => {
    const { storyId } = useParams();

    // form state
    const [inputValue, setInputValue] = useState('');
    const onInputValueChange = e => setInputValue(e.target.value)
    
    // input functions
    const onClear = () => {
        setInputValue('');
    }

    // create entry
    const [createEntry] = useMutation(create, {
        onError: () => console.log('Oops!'),
    });

    // submit form
    const onSubmit = async e => {
        e.preventDefault();
        if (_.trim(inputValue) !== '') {
            createEntry({ storyId, text: inputValue });
            setInputValue('');
        }
    };

    return [{
        inputValue,
    }, {
        onClear,
        onInputValueChange,
        onSubmit,
    }];
}