import _ from 'lodash-es';
import firebase from 'firebase';
import config from '../../configs/config.json';
import * as constants from '../constants';

const { firebaseAppConfig, firebaseVapidKey } = config;
const { PATHS } = constants;

// TODO: Move all of this behind a server

// initialize firebase
firebase.initializeApp(firebaseAppConfig); 
const auth = firebase.auth();
const db = firebase.database();

// authentication helpers
export const createUser = ({ email, password }) => auth.createUserWithEmailAndPassword(email, password);
export const signIn = ({ email, password }) => auth.signInWithEmailAndPassword(email, password);
export const signOut = () => auth.signOut();
export const getUser = () => auth.currentUser;
export const subscribeToAuthChanges = callback => {
  // middleware to add userToken, which is async
  const onAuthChange = async user => {
    if (!user) callback(null);

    callback({
      email: user.email,
      id: user.uid,
      displayName: user.displayName || 'User Display Name',
      userToken: await user.getIdToken(),
    });
  };

  // this subscription function returns its unsubscription function
  const unsubscribeToAuthChanges = auth.onAuthStateChanged(onAuthChange);
  return unsubscribeToAuthChanges;
};

// list stories
const subscribeToStoryList = callback => db.ref(PATHS.stories).on('value', async snapShot => {
  const storyData = snapShot.val();

  const storiesFormatted = _.map(storyData, (story, key) => ({
    authorId: story.author.id,
    authorName: story.author.name,
    description: story.description,
    id: key,
    maxPlayerCount: story.maxPlayerCount,
    name: story.name,
    open: story.open,
    playerCount: story.players?.length || 0,
  }));

  // TODO: filter what stories are shown by whether they have slots open
  // OR user already belongs to them

  // const openStories = _.filter(storiesFormatted, story => 
  //   (story.open === true && story.maxPlayerCount > story.playerCount)
  // );
  callback(storiesFormatted);
});
const unsubscribeToStoryList = () => db.ref(PATHS.stories).off();

export const subscribeToStory = ({ storyId, onUpdate }) => {
  db.ref(`${PATHS.stories}/${storyId}`).on('value', snapShot => {
    const story = snapShot.val();
    const userId = getUser().uid;

    const userIsPlayer = _.some(story.players, (player, playerId) => (userId === playerId));
    const userIsAuthor = userId === story.author.id;

    onUpdate({
      authorId: story.author.id,
      description: story.description,
      name: story.name,
      userIsAuthor,
      userIsPlayer,
    });
  });
};
export const unsubscribeToStory = ({ storyId }) => db.ref(`${PATHS.stories}/${storyId}`).off();

export const subscribeToEntries = ({ storyId, onUpdate }) => {
  db.ref(`${PATHS.entries}/${storyId}`).on('value', (snapShot) => {
    const entries = snapShot.val();

    onUpdate(entries);
  });
};
export const unsubscribeToEntries = ({ storyId }) => db.ref(`${PATHS.entries}/${storyId}`).off();


// push notifications


// addDeviceToNotificationsList({ onSubscribeToNotifications, storyId });

// const messaging = firebase.messaging();

// function addDeviceToNotificationsList({ onSubscribeToNotifications, storyId }) {
//   messaging.getToken({ vapidKey: firebaseVapidKey })
//     .then(token => {
//       if (!token) {
//         console.log('No registration token available. Request permission to generate one.');
//         onSubscribeToNotifications({ didSucceed: false });
//         return;
//       }
      
//       // save token to database
//       db.ref(`${rootPath}/${storyId}/notificationTokens`).push({
//         userId: getUser().uid,
//         token,
//       });
//       onSubscribeToNotifications({ didSucceed: true });
//     })
//     .catch((err) => {
//       console.log('An error occurred while retrieving token. ', err);
//       onSubscribeToNotifications({ didSucceed: false });
//     });
// }

export const firebaseServices = {
  storyList: {
    subscribe: subscribeToStoryList,
    unsubscribe: unsubscribeToStoryList,
  },
  story: {
    subscribe: subscribeToStory,
    unsubscribe: unsubscribeToStory,
  },
  entries: {
    subscribe: subscribeToEntries,
    unsubscribe: unsubscribeToEntries,
  }
};