// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCHldvTJnBwwotDDovp2aSyL1yjBHpBlWI",
  authDomain: "algo-1f875.firebaseapp.com",
  projectId: "algo-1f875",
  storageBucket: "algo-1f875.appspot.com",
  messagingSenderId: "604903582475",
  appId: "1:604903582475:web:da77b9e01273c93060100e",
  measurementId: "G-N9TWRS6B33"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);