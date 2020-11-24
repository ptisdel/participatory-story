import _ from 'lodash-es';
import React from 'react';
import {
  Switch,
  Redirect,
  Route,
  Link,
} from 'react-router-dom';
import { HomePage, LoginPage, PageNotFound, RegisterPage, StoryPage } from '../pages';
import { useApp } from './logic';

export const App = () => {
  const [{ isAuthenticated }, { logOut }] = useApp();

  const AuthenticatedLinks = () => {
    return <>
      <li><a href='' onClick={logOut}>Log Out</a></li>
    </>;
  }

  const UnauthenticatedLinks = () => {
    return <>
      <li><Link to='/login'>Login</Link></li>
      <li><Link to='/register'>Register</Link></li>
    </>;
  }

  return (
    <>
      <nav>
        <ul>
          <li><Link to='/'>Home</Link></li>
          { !isAuthenticated && <UnauthenticatedLinks/> }
          { isAuthenticated && <AuthenticatedLinks/> }
        </ul>
      </nav>
      <Switch>        
        <Route exact path='/'>
          <PublicPage><HomePage/></PublicPage>
        </Route>
        <Route path='/login'>
          <PublicOnlyPage><LoginPage/></PublicOnlyPage>
        </Route>
        <Route path='/register'>
          <PublicOnlyPage><RegisterPage/></PublicOnlyPage>
        </Route>
        <Route path='/story/:storyId'>
          <PrivatePage isAuthenticated={isAuthenticated}><StoryPage/></PrivatePage>
        </Route>
        <Route path="*">
          <PageNotFound/>
        </Route>
      </Switch>
    </>
  );
};

const PrivatePage = ({ isAuthenticated, children }) => {
  return isAuthenticated
    ? children
    : <Redirect to={{ pathname: '/login' }} />
};

const PublicPage = ({ children }) => {
  return children;
};

const PublicOnlyPage = ({ isAuthenticated, children }) => {
  return isAuthenticated
    ? <Redirect to={{ pathname: '/story' }} />
    : children
};
