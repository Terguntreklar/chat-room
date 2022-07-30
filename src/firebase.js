import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

firebase.initializeApp({
    apiKey: "AIzaSyCcOH31ooiSwNY7bQUbVUdliPWm73ys_Rg",
    authDomain: "chat-room-efca6.firebaseapp.com",
    projectId: "chat-room-efca6",
    storageBucket: "chat-room-efca6.appspot.com",
    messagingSenderId: "60049412890",
    appId: "1:60049412890:web:6ce6ed2102d9ae6e3d12a3",
    measurementId: "G-KVYBMFHVNK"
  })
const auth = firebase.auth()
const firestore = firebase.firestore()

export {firebase,auth,firestore}