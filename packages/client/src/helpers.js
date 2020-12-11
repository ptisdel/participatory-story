import _ from 'lodash-es';
import { getUser, subscribeToAuthChanges, test } from './services/firebase';
import { useEffect, useRef, useState } from 'react';

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

  // disables callback's state updates if component is unmounted
  const isMountedRef = useRef(true);
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(user => {
      if (isMountedRef.current === false) return;
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

    return () => {
      isMountedRef.current = false;
      unsubscribe();
    }
  }, []);

  return { user, isInitializing };
}