import admin from 'firebase-admin';
import config from '../configs/config.json';
import serviceAccount from '../configs/firebase-admin-private-key.json';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: config.firebaseAppConfig.databaseURL,
});

const auth = admin.auth();
const db = admin.database(); 

export { auth, db };