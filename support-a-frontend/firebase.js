import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBlvwFDHHGCKRAOZSygdbRzRZKPZQnBrrw",
    authDomain: "support-a-rattler.firebaseapp.com",
    projectId: "support-a-rattler",
    storageBucket: "support-a-rattler.appspot.com",
    messagingSenderId: "191296613393",
    appId: "1:191296613393:web:edc2f731bcbe71d67e95b0",
    measurementId: "G-KFM4Y8NEWR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };