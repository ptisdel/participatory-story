import * as services from '../services';
import { getUserFromRequest } from '../helpers';

const { db } = services.firebaseAdmin;

var dbRef = db.ref('stories');

export const createStory = async (req, res) => {
  const user = await getUserFromRequest(req);
  if (!user) return res.status(403).json({ error: 'Invalid credentials, friend!' });
  
  // get new story data
  const { description, name, playerCount } = req.body;

  // create story in firebase
  const newStoryRef = await dbRef.push({
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
    sections: {
      0: {
        name: 'Chapter One',
      },
    },
  });

  const newStoryId = newStoryRef.key;

  if (!newStoryId) return res.status(404).json({ error: 'Unable to create story.' });    
  return res.status(200).json({ storyId: newStoryId });
};
