import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyCKvJIqxq8u_nVouPgSrRS6R5ca25SRGX0",
  authDomain: "mypro-d522e.firebaseapp.com",
  projectId: "mypro-d522e",
  storageBucket: "mypro-d522e.firebasestorage.app",
  messagingSenderId: "997512009251",
  appId: "1:997512009251:web:b972d91d1d11cf64d44396"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);