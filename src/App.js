import './App.css';

import React from 'react'
import { firebase,auth,firestore } from "./firebase";

import { SignIn } from './SignIn';
import { SignOut } from './SignOut';
// import {SignIn} from './Signing';
// import {SignOut} from './Signing'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

const DBmessages = firestore.collection('messages') // refers to collection of messages in firebase, can be queried, removed from and added into

// check https://www.pluralsight.com/guides/setting-up-a-react-project-from-github on how to run this and install necessary files in node_modules
function App() {
  const [user] = useAuthState(auth)
  return (
    <div className="App">
      <header className="App-header">
        <section>
          {user?<SignOut/>:<SignIn/>} {/* replace null here with the hompage rfc */}
        </section>
      </header>
    </div>
  )
}

function DebugFunction() {//function for notes, to be deleted later, not a comment to provide highlighting

  //how to get user auth info: referenced from https://firebase.google.com/docs/auth/web/manage-users#web-version-8_1
  if (auth.currentUser() !== null) {
      auth.currentUser().providerData.forEach((user) => { //use auth.currentUser().member to get value of member,
      console.log("Sign-in provider: " + user.providerId);
      console.log("  Provider-specific UID: " + user.uid);// auth.currentUser().uid returns same result
      console.log("  Name: " + user.displayName);
      console.log("  Email: " + user.email);
      console.log("  Photo URL: " + user.photoURL); //photo associated with email
    });
  }
  console.log(firebase.database.ServerValue.TIMESTAMP) //returns current date, never use any other js time function to get time
}
class message{ //class to hold information on messages, should be a prop in the ' Message ' react function component
  constructor(content, uid, name){
    this.content = content
    this.uid = uid
    this.name = name
  }
}
async function sendMessageToDB(message){ //should add message to firestore
  const uid = auth.currentUser().uid
  const photoURL = auth.currentUser().photoURL
  try {
    await DBmessages.add({
      text: message.content,
      date: firebase.firestore.FieldValue.serverTimestamp(),
      uid: uid,
      photo: photoURL
    })
  } catch (e) {
    console.log(e)
  }
}

export default App;