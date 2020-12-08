import _ from 'lodash-es';
import * as services from '../services';
import * as helpers from '../helpers';

const { getUserFromRequest } = helpers;
const { db } = services.firebaseAdmin;

const rootPath = 'stories';

export const createEntry = async (req, res) => {
    const user = await getUserFromRequest(req);
    console.log(user);
    if (!user) return res.status(403).json({ error: 'Invalid credentials, friend!' });
  
    // get new entry data
    const { text } = req.body;
    const { storyId } = req.params;
  
    // verify user belongs to the story
    const authorRef = await db.ref(`${rootPath}/${storyId}/author`).once('value');
    const author = authorRef.val();
    const storyUsersRef = await db.ref(`${rootPath}/${storyId}/players`).once('value');
    const storyUsers = storyUsersRef.val();
    const userId = user.uid;
    const userCanPost = (
        userId === author.id
        || _.some(storyUsers, user => (user.playerId === userId))
    );
    if (!userCanPost) return res.status(403).json({ error: 'Invalid credentials, friend!' });

    const currentSectionRef = await db.ref(`${rootPath}/${storyId}/currentSection`).once('value');
    const currentSection = currentSectionRef.val();

    const newEntryRef = await db.ref(`${rootPath}/${storyId}/sections/${currentSection}/entries`).push({
        text: text,
        timestamp: Date.now(),
        authorId: userId,
    });

    const newEntryId = newEntryRef.key;

    if (!newEntryId) return res.status(404).json({ error: 'Unable to create entry.' });    
    return res.status(200).json({ entryId: newEntryId });
}