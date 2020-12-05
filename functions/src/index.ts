import admin from 'firebase-admin';
admin.initializeApp();

export { createStory } from './http';
export { notifyOnNewEntry } from './story';
