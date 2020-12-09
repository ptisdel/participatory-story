import { useState } from 'react';
import { signOut } from '../services/firebase';
import { useHistory } from 'react-router-dom';
import * as helpers from '../helpers';

const { useAuthentication } = helpers;

export const useApp = () => {
  const history = useHistory();

  const { isInitializing, user } = useAuthentication({
    onLogin: () => history.push('/'),
    onLogout: () => history.push('/login'),
  })

  const logOut = () => {
    signOut().then(() => {
      alert('Signed out!');
    }).catch(error => {
      alert(`Error ${error.code}: ${error.message}`);
    });
  }

  return [{
    isAuthenticated: Boolean(user),
    isLoading: isInitializing,
  }, {
    logOut,
  }];
}