import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

// Firebase config
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: ""
};

firebase.initializeApp(firebaseConfig);

export {
    firebase
};
