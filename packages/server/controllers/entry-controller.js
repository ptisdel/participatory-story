import _ from 'lodash-es';
import * as constants from '../constants';
import * as services from '../services';
import * as helpers from '../helpers';

const { PATHS } = constants;

const { getUserFromRequest } = helpers;
const { db } = services.firebaseAdmin;

export const createEntry = async (req, res) => {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(403).json({ error: 'Invalid credentials, friend!' });
    const userId = user.uid;

    // get new entry data
    const { type, text } = req.body;
    const { storyId } = req.params;
  
    // check if user is author
    const authorSnapshot = await db.ref(`${PATHS.stories}/${storyId}/author`).once('value');
    const author = authorSnapshot.val();
    const isAuthor = (userId === author.id);

    // check if user is a player
    const playersSnapshot = await db.ref(`${PATHS.stories}/${storyId}/players`).once('value');
    const players = playersSnapshot.exists() ? playersSnapshot.val() : {};
    const isPlayer = _.some(players, (player, playerId) => (userId === playerId));

    if (!isAuthor && !isPlayer) return res.status(403).json({ error: 'Invalid credentials, friend!' });

    const newEntryRef = await db.ref(`${PATHS.entries}/${storyId}`).push({
        text,
        timestamp: Date.now(),
        type,
        authorId: userId,
    });

    const newEntryId = newEntryRef.key;

    if (!newEntryId) return res.status(404).json({ error: 'Unable to create entry.' });    
    return res.status(200).json({ entryId: newEntryId });
}