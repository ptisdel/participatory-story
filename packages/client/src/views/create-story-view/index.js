import _ from 'lodash-es';
import React from 'react';
import { CreateStoryForm } from './components/create-story-form';

export const CreateStoryView = () => {

  return (
    <div id='page-layout'>
      <div className='form-card'>
        <CreateStoryForm/>
      </div>
    </div>
  );
}