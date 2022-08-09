import './App.css';

import React, { useRef } from 'react'
import { firebase,auth } from "./firebase";
import { SignIn } from './SignIn';
import { useAuthState } from 'react-firebase-hooks/auth'
import MessageIcon from '@mui/icons-material/Message';
import { pink } from '@mui/material/colors';

import MessageRoom from './MessageRoom';
import { SignOut } from './SignOut';
// check https://www.pluralsight.com/guides/setting-up-a-react-project-from-github on how to run this and install necessary files in node_modules
function App() {
  const [user] = useAuthState(auth)

  return (
    <div className="App">
      <header className="App-header">
        <h1 className='main-title'>Chat Room</h1>
        {user ? <SignOut /> : <MessageIcon sx={{ color: pink[500], fontSize: 40 }} />}
      </header>
      <main>
        {
          user ?
          <MessageRoom /> :
          <div className='signin-cont'>
            <SignIn />
          </div>
        }
      </main>
    </div>
  );
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

export default App;