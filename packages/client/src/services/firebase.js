import _ from 'lodash-es';
import firebase from 'firebase';
import config from '../../configs/config.json';

const { firebaseAppConfig, firebaseVapidKey } = config;

// TODO: Move all of this behind a server

// initialize firebase
firebase.initializeApp(firebaseAppConfig); 
const auth = firebase.auth();
const db = firebase.database();  
const rootPath = 'stories';

// authentication helpers
export const createUser = ({ email, password }) => auth.createUserWithEmailAndPassword(email, password);
export const signIn = ({ email, password }) => auth.signInWithEmailAndPassword(email, password);
export const signOut = () => auth.signOut();
export const onAuthChanged = (callback) => auth.onAuthStateChanged(callback);
export const getUser = () => auth.currentUser;
export const subscribeToAuthChanges = callback => {
  // middleware to add userToken, which is async
  const onAuthChange = async user => {
    if (!user) callback(null);

    callback({
      userId: user.uid,
      userDisplayName: user.displayName || 'User Display Name',
      userToken: await user.getIdToken(),
    });
  };

  // this subscription function returns its unsubscription function
  const unsubscribeToAuthChanges = auth.onAuthStateChanged(onAuthChange);
  return unsubscribeToAuthChanges;
};

// list stories
const subscribeToStoryList = callback => db.ref(rootPath).on('value', snapShot => {
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
const unsubscribeToStoryList = () => db.ref(rootPath).off();


// download any story updates and notify user of them
export const subscribeToStory = ({ storyId, onUpdate }) => {
  db.ref(`${rootPath}/${storyId}`).on('value', (snapShot) => {
    const story = snapShot.val();
    const authorId = story?.author?.id;
    const currentSection = story?.currentSection;
    const sections = story?.sections;

    onUpdate({
      authorId,
      sections,
    });
  });
};
export const unsubscribeToStory = ({ storyId }) => db.ref(`${rootPath}/${storyId}`).off();

// write to story
export const submitRequest = async ({ storyId, text }) => {
  // find latest section id
  db.ref(`${rootPath}/${storyId}/sections`).orderByChild('timestamp').limitToLast(1).once('child_added')
    .then(snapShot => {
      if (!snapShot) return;
      const latestSectionKey = snapShot.key;
      const pathToCurrentSection = `${rootPath}/${storyId}/sections/${latestSectionKey}/entries`;
      db.ref(pathToCurrentSection).push({
        text: text,
        timestamp: Date.now(),
        authorId: getUser().uid,
      });
    }); 
};

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
};