import { useEffect, useState } from 'react';
import { signOut, onAuthChanged } from '../services/firebase';
import { useHistory } from 'react-router-dom';

export const useApp = () => {
  const history = useHistory();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // if auth state changes, change isAuthenticated
    onAuthChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
        history.push('/')
      } else {
        setIsAuthenticated(false);
        history.push('/login')
      }
    }), [history]});

  const logOut = () => {
    signOut().then(() => {
      alert('Signed out!');
    }).catch(error => {
      alert(`Error ${error.code}: ${error.message}`);
    });
  }

  return [{
    isAuthenticated,
  }, {
    logOut,
  }];
}