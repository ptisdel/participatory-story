import { getUser } from './services/firebase';

export const getIsAuthenticated = () => {
  return Boolean(getUser());
}

export const getUserId = () => {
  const user = getUser();
  return user.uid;
}