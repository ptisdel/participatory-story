import { getUser } from './services/firebase';

export const getIsAuthenticated = () => {
  return Boolean(getUser());
}

export const getUserId = async () => {
  const user = getUser();
  return user.uid;
}

export const getUserToken = async () => {
  const user = getUser();
  return user.getIdToken();
}