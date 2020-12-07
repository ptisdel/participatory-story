import _ from 'lodash-es';
import React from 'react';
import {
  Switch,
  Redirect,
  Route,
  Link,
} from 'react-router-dom';
import {
  CreateStoryView,
  HomeView, 
  LoginView,
  PageNotFoundView,
  RegisterView,
  StoryView
} from '../views';
import { useApp } from './logic';

export const App = () => {
  const [{ isAuthenticated }, { logOut }] = useApp();

  const AuthenticatedLinks = () => {
    if (!isAuthenticated) return null;

    return <>
      <li><a href='' onClick={logOut}>Log Out</a></li>
    </>;
  }

  const UnauthenticatedLinks = () => {
    if (isAuthenticated) return null;

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
          <UnauthenticatedLinks/>
          <AuthenticatedLinks/>
        </ul>
      </nav>
      <Switch>        
        <Route exact path='/'>
          <PublicView><HomeView/></PublicView>
        </Route>
        <Route path='/login'>
          <PublicOnlyView><LoginView/></PublicOnlyView>
        </Route>
        <Route path='/register'>
          <PublicOnlyView><RegisterView/></PublicOnlyView>
        </Route>
        <Route path='/story/:storyId'>
          <PrivateView isAuthenticated={isAuthenticated}><StoryView/></PrivateView>
        </Route>
        <Route path='/create-story'>
          <PrivateView isAuthenticated={isAuthenticated}><CreateStoryView/></PrivateView>
        </Route>
        <Route path="*">
          <PageNotFoundView/>
        </Route>
      </Switch>
    </>
  );
};

const PrivateView = ({ isAuthenticated, children }) => {
  return isAuthenticated
    ? children
    : <Redirect to={{ pathname: '/login' }} />
};

const PublicView = ({ children }) => {
  return children;
};

const PublicOnlyView = ({ isAuthenticated, children }) => {
  return isAuthenticated
    ? <Redirect to={{ pathname: '/story' }} />
    : children
};
