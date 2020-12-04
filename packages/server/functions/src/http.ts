import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

var db = admin.database();
var dbRef = db.ref('stories');

export const createStory = functions.https.onRequest((req, res) => {
  const { authorId, description, name, playerCount } = req.params;

  const author = await admin.auth().getUser(authorId);

  dbRef.put({
    author: {
      id: author.uid,
      displayName: author.displayName,
    },
    createdAt: Date.now(),
    currentSection: 0,
    description,
    maxPlayerCount: playerCount,
    name,
    open: true,
  })
  .then(snapShot => {
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify({ storyId: snapShot.name() }))
    return null;
  })
  .catch(error => {
    res.status(401).send('Sorry, there has been an unexpected error.');
  });
});