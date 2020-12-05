import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

var db = admin.database();
var dbRef = db.ref('stories');

export const createStory = functions.https.onRequest(async (req, res) => {
  const { authorId, description, name, playerCount } = req.params;

  const author = await admin.auth().getUser(authorId);

  const storyKey = await dbRef.push({
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
  });

  if (!storyKey){
    res.status(401).send('Sorry, there has been an unexpected error.');
    return;
  }
  
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ storyId: storyKey }));
});