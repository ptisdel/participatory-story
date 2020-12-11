import _ from 'lodash-es';
import * as services from '../services';
import * as constants from '../constants';
import { getUserFromRequest } from '../helpers';

const { PATHS } = constants;
const { db } = services.firebaseAdmin;

export const createStory = async (req, res) => {
  const user = await getUserFromRequest(req);
  if (!user) return res.status(403).json({ error: 'Invalid credentials, friend!' });
  
  // get new story data
  const { description, name, playerCount } = req.body;
  
  // create story in firebase
  const storiesRef = db.ref(PATHS.stories);
  const newStoryRef = await storiesRef.push({
    author: {
      id: user.uid,
      name: user.displayName || 'author name',
    },
    createdAt: Date.now(),
    description,
    maxPlayerCount: playerCount,
    name,
    open: true,
  });

  const newStoryId = newStoryRef.key;

  if (!newStoryId) return res.status(404).json({ error: 'Unable to create story.' });    
  return res.status(200).json({ storyId: newStoryId });
};

export const modifyPlayers = async (req, res) => {
  const user = await getUserFromRequest(req);
  if (!user) return res.status(403).json({ error: 'Invalid credentials, friend!' });
  const userId = user.uid;

  // get request data
  const { action, storyId } = req.body;

  // ensure user isn't author
  const authorRef = db.ref(`${PATHS.stories}/${storyId}/author`);
  const authorSnapShot = await authorRef.once('value');
  const author = authorSnapShot.val();
  if (userId === author.id) return res.status(403).json({ error: 'User is the author; cannot join or leave story.'});

  if (action === 'add') {
    // verify user is not already member
    const playersRef = db.ref(`${PATHS.stories}/${storyId}/players`);
    const playersSnapshot = await playersRef.once('value');

    if (playersSnapshot.exists()) {
        const players = playersSnapshot.val();
        const isAlreadyPlayer = _.some(players, (player, playerId) => (userId === playerId));
        if (isAlreadyPlayer) return res.status(403).json({ error: 'User is already a player.' });
    }

    try {
      await playersRef.set({ [userId]: true });
    } catch {
      return res.status(404).json({ error: 'Unknown error adding player.' });
    }

    return res.status(200).json({ player: userId });
  }

  // TODO: add 'remove' action
 
  return res.status(403).json({ error: 'Unknown action.' });
};
