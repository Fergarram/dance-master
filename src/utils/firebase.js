// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCa4rCr-DPqsdeC4KdD9ltzGhkDdi5DGDo",
  authDomain: "huvison.firebaseapp.com",
  databaseURL: "https://huvison-default-rtdb.firebaseio.com",
  projectId: "huvison",
  storageBucket: "huvison.appspot.com",
  messagingSenderId: "593851825711",
  appId: "1:593851825711:web:8a26e18ab979aa9e6d10da",
  measurementId: "G-NBKSKGR977"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;
