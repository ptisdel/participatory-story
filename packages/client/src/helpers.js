import _ from 'lodash-es';
import { getUser, subscribeToAuthChanges, test } from './services/firebase';
import { useEffect, useState } from 'react';

export const getAuthentication = async () => {
  const user = await getUser();
  
  return {
    isAuthenticated: Boolean(user),
    userId: user?.uid,
    userToken: await user?.getIdToken(),
  };
}

export const useAuthentication = ({ onLogin = _.noop, onLogout = _.noop } = {}) => {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(user => {
      setIsInitializing(false);
      if (user) {
        setUser({
          userId: user.userId, 
          userToken: user.userToken,
          userDisplayName: user.displayName,
        });
        onLogin();
      } else {
        setUser(null);
        onLogout();
      }
    });

    return unsubscribe;
  }, []);

  return { user, isInitializing };
}