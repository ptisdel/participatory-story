import React from 'react';
import ReactDOM from 'react-dom';
import { QueryCache, ReactQueryCacheProvider } from 'react-query'
import { BrowserRouter as Router } from 'react-router-dom';
import { App } from './app';
import './normalize.css';
import './styles.scss';

const queryCache = new QueryCache()

ReactDOM.render(
  <Router>
    <ReactQueryCacheProvider queryCache={queryCache}>
      <App/>
    </ReactQueryCacheProvider>
  </Router>,
  document.getElementById('root'),
);
