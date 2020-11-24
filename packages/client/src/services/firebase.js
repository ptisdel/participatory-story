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

// initialize firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth;
const db = firebase.database();  

// authentication helpers
export const createUser = ({ email, password }) => auth().createUserWithEmailAndPassword(email, password);
export const signIn = ({ email, password }) => auth().signInWithEmailAndPassword(email, password);
export const signOut = () => auth().signOut();
export const onAuthChanged = (callback) => auth().onAuthStateChanged(callback);
export const getUser = () => auth().currentUser;

// read story list
const pathToStoriesList = 'stories';
export const onStoryListUpdate = (callback) => db.ref(pathToStoriesList).on('value', (snapShot) => {
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

// read story
export const subscribeToStoryChanges = ({ storyId, onUpdate }) => {
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

  return {
    unsubscribe: () => db.ref(pathToStory).off(),
  };
};

// write to story
export const submitRequest = ({ currentSection, storyId, text }) => {
  const pathToCurrentSection = `${pathToStoriesList}/${storyId}/sections/${currentSection}/entries`;
  return db.ref(pathToCurrentSection).push({
    text: text,
    timestamp: Date.now(),
    author: getUser().uid,
  });
};

// push notifications
const messaging = firebase.messaging();
const vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY;

messaging.getToken({ vapidKey }).then((currentToken) => {
  if (currentToken) {
    sendTokenToServer(currentToken);
    updateUIForPushEnabled(currentToken);
  } else {
    // Show permission request.
    console.log('No registration token available. Request permission to generate one.');
    // Show permission UI.
    updateUIForPushPermissionRequired();
    setTokenSentToServer(false);
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
  showToken('Error retrieving registration token. ', err);
  setTokenSentToServer(false);
});