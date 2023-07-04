// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5ptQ77pBjOW0YZpLkmQjj1cDN-q1VASk",
  authDomain: "universe-a9cc0.firebaseapp.com",
  projectId: "universe-a9cc0",
  storageBucket: "universe-a9cc0.appspot.com",
  messagingSenderId: "694384252855",
  appId: "1:694384252855:web:bf582e74b93e6096d87a32"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export {db, auth, storage}


