import { initializeApp } from "firebase/app";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCM8ycBBaxhmf1h1iraxuO-jSzfbZRhIhE",
    authDomain: "hackathon-8dd92.firebaseapp.com",
    projectId: "hackathon-8dd92",
    storageBucket: "hackathon-8dd92.appspot.com",
    messagingSenderId: "837511050213",
    appId: "1:837511050213:web:ff5b14d6f0609234d9f50c"
  };

// Initialize Firebase
let app;
app = firebase.initializeApp(firebaseConfig);
export default app;
const auth = firebase.auth();
export { auth };
const analytics = getAnalytics(app);