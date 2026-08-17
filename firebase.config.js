// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjwlx2q8AgWLw1oCW3X6hZ-LIfzCgYCJM",
  authDomain: "autoconnect-423610.firebaseapp.com",
  projectId: "autoconnect-423610",
  storageBucket: "autoconnect-423610.appspot.com",
  messagingSenderId: "330512410932",
  appId: "1:330512410932:web:b1b0c55a33ea1647399d61",
  measurementId: "G-VK6CXT746P",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
