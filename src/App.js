import './App.css';

import React from 'react'

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

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
// check https://www.pluralsight.com/guides/setting-up-a-react-project-from-github on how to run this and install necessary files in node_modules
function App() {
  const [user] = useAuthState(auth)
  return (
    <div className="App">
      <header className="App-header">
        <section>
          {user?null:<SignIn/>} {/* replace null here with the hompage rfc */}
        </section>
      </header>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () =>{
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  }
  return <button onClick={signInWithGoogle}>sign in with google</button>
}
export default App;

