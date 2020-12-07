import admin from 'firebase-admin';
import config from '../configs/config.json';
import serviceAccount from '../configs/firebase-admin-private-key.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.firebaseAppConfig.databaseURL,
});

var db = admin.database();
var dbRef = db.ref('stories');

export const createStory = async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ error: 'No credentials sent!' });
  }

  // derive user info from authorization header
  const userToken = req.headers.authorization.split(' ')[1]; // get bearer token
  const decodedIdToken = await admin.auth().verifyIdToken(userToken);
  if (!decodedIdToken) return res.status(403).json({ error: 'Token could not be verified!' });
  const user = await admin.auth().getUser(decodedIdToken.uid);
  
  // get new story data
  const { description, name, playerCount } = req.body;

  // create story in firebase
  const storyRef = await dbRef.push({
    author: {
      id: user.uid,
      displayName: user.displayName || '',
    },
    createdAt: Date.now(),
    currentSection: 0,
    description,
    maxPlayerCount: playerCount,
    name,
    open: true,
  });

  const storyId = storyRef.key;

  if (!storyId) return res.status(404).json({ error: 'Unable to create story.' });    
  return res.status(200).json({ storyId });
};
