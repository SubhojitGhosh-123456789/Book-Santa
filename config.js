import firebase from "firebase";
require("@firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyBUY_KD_WGUBAJyylItBGXX676l-j9Xocg",
    authDomain: "booksanta-982f6.firebaseapp.com",
    databaseURL: "https://booksanta-982f6-default-rtdb.firebaseio.com",
    projectId: "booksanta-982f6",
    storageBucket: "booksanta-982f6.appspot.com",
    messagingSenderId: "849753325885",
    appId: "1:849753325885:web:378fc2f087aaf6233c8554",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
