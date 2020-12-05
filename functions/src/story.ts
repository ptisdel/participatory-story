import _ from 'lodash';
import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

admin.initializeApp();

export const notifyOnNewEntry = functions.database
  .ref('/stories/{storyId}/sections/{sectionId}/entries/{entryId}')
  .onCreate(async (snapshot, context) => {

    const storyId = context.params.storyId;

    // create notification payload
    const { authorId, text } = snapshot.val(); // the created entry object
    const storyName = await admin.database()
          .ref(`/stories/${storyId}/name`)
          .once('value');
    const payload = {
      notification: {
        title: `New update for ${storyName}`,
        body: text,
        // TODO: add icon url
      }
    };

    // notify all users who are subscribed to updates
    const notificationTokensSnapshot = await admin.database()
          .ref(`/stories/${storyId}/notificationTokens`).once('value');
    const notificationTokenObjects = notificationTokensSnapshot.val();
    const notificationTokens = _.reduce(notificationTokenObjects, (acc, tokenObj) => {
      const { token, userId } = tokenObj;

      if (authorId === userId) return acc;
      return [...acc, token];
    }, [] as any);

    await admin.messaging().sendToDevice(notificationTokens, payload);
  })