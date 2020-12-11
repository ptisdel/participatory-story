import _ from 'lodash-es';
import React from 'react';
import { Link } from 'react-router-dom';

export const PageNotFoundView = () => {
  return (
    <div id='page-layout'>
      <h1>Sorry! Page not found.</h1>
      <ul>
        <li><Link to='/'>Return to the home page</Link></li>
      </ul>
    </div>
  );
}