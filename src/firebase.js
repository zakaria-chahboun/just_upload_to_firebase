import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyC5F2t4D9EL8Tg4WVN2-T3PSriCL5YJfzo",
    authDomain: "supercode-40a70.firebaseapp.com",
    databaseURL: "https://supercode-40a70.firebaseio.com",
    projectId: "supercode-40a70",
    storageBucket: "supercode-40a70.appspot.com"
};

firebase.initializeApp(firebaseConfig);

export {
    firebase
};