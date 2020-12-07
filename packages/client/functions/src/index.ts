import admin from 'firebase-admin';

admin.initializeApp();

export { notifyOnNewEntry } from './story-functions';
