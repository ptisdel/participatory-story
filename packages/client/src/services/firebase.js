import _ from 'lodash-es';
import firebase from 'firebase';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// TODO: Move all of this behind a server

// initialize firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();  
const pathToStoriesList = 'stories';

// authentication helpers
export const createUser = ({ email, password }) => auth.createUserWithEmailAndPassword(email, password);
export const signIn = ({ email, password }) => auth.signInWithEmailAndPassword(email, password);
export const signOut = () => auth.signOut();
export const onAuthChanged = (callback) => auth.onAuthStateChanged(callback);
export const getUser = () => auth.currentUser;

// create story
export const createStory = ({ callback, name, description, playerCount }) => {
  db.ref(pathToStoriesList).push({
    author: {
      id: getUser().uid,
      displayName: getUser().displayName,
    },
    createdAt: Date.now(),
    currentSection: 0,
    description,
    maxPlayerCount: playerCount,
    name,
    open: true,
  }).then(snap => callback({ storyId: snap.key }));
};

// read story list
export const registerStoryListUpdates = (callback) => db.ref(pathToStoriesList).on('value', (snapShot) => {
  const storyData = snapShot.val();

  const storiesFormatted = _.map(storyData, (story, key) => ({
    author: {
      id: story.author?.id,
      name: story.author?.publicName,
    },
    description: story.description,
    id: key,
    maxPlayerCount: story.maxPlayerCount,
    name: story.name,
    open: story.open,
    playerCount: story.players?.length || 0,
  }));

  const openStories = _.filter(storiesFormatted, story => 
    (story.open === true && story.maxPlayerCount > story.playerCount)
  );

  callback(openStories);
});
export const cleanUpStoryListUpdate = () => db.ref(pathToStoriesList).off();

// download any story updates and notify user of them
export const subscribeToStoryChanges = ({ storyId, onSubscribeToNotifications, onUpdate }) => {
  const pathToStory =  `${pathToStoriesList}/${storyId}`;

  db.ref(pathToStory).on('value', (snapShot) => {
    const story = snapShot.val();
    const authorId = story?.author?.id;
    const currentSection = story?.currentSection;
    const sections = story?.sections;

    onUpdate({
      authorId,
      currentSection,
      sections,
    });
  });

  addDeviceToNotificationsList({ onSubscribeToNotifications, storyId });

  return {
    unsubscribe: () => db.ref(pathToStory).off(),
  };
};

// write to story
export const submitRequest = ({ callback, currentSection, storyId, text }) => {
  const pathToCurrentSection = `${pathToStoriesList}/${storyId}/sections/${currentSection}/entries`;
  db.ref(pathToCurrentSection).push({
    text: text,
    timestamp: Date.now(),
    authorId: getUser().uid,
  });
};

// push notifications
const messaging = firebase.messaging();
const vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY;

function addDeviceToNotificationsList({ onSubscribeToNotifications, storyId }) {
  messaging.getToken({ vapidKey })
    .then(token => {
      if (!token) {
        console.log('No registration token available. Request permission to generate one.');
        onSubscribeToNotifications({ didSucceed: false });
        return;
      }
      
      // save token to database
      db.ref(`${pathToStoriesList}/${storyId}/notificationTokens`).push({
        userId: getUser().uid,
        token,
      });
      onSubscribeToNotifications({ didSucceed: true });
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
      onSubscribeToNotifications({ didSucceed: false });
    });
}