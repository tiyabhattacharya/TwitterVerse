// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBxI3NbpB_xO0DKeztlAXOei_XNKL2m48Y",
  authDomain: "twitterverse-40c04.firebaseapp.com",
  projectId: "twitterverse-40c04",
  storageBucket: "twitterverse-40c04.appspot.com",
  messagingSenderId: "472356548669",
  appId: "1:472356548669:web:6bba3850e18cd3d42c7a54",
  measurementId: "G-TC1E9F8JCS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth =getAuth(app);
export default auth;