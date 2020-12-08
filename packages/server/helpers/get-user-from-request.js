
import _ from 'lodash-es';
import * as services from '../services';

const { auth } = services.firebaseAdmin;

export const getUserFromRequest = async req => {
  if (!req.headers.authorization) return null;

  // derive user info from authorization header
  const userToken = _.get(req.headers.authorization.split(' '), 1); // get bearer token
  const decodedIdToken = await auth.verifyIdToken(userToken);
  if (!decodedIdToken) return null;
  const user = await auth.getUser(decodedIdToken.uid);

  return user;
};
