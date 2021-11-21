import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  // Firebase,
  collection,
  // getDoc,
  getDocs,
  getFirestore,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FB_API_KEY,
  authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FB_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FB_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FB_APP_ID,
  measurementId: process.env.REACT_APP_FB_MEASUREMENT_ID,
};

if (getApps().length === 0) {
  initializeApp(firebaseConfig);
}

class Firebase {
  private fireStore: any;

  constructor() {
    this.fireStore = getFirestore();
  }

  async getDocs() {
    const querySnapshot = await getDocs(collection(this.fireStore, 'comments'));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
    });
  }
}
export default new Firebase();
