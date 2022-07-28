import React from 'react'
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const auth = firebase.auth()
const firestore = firebase.firestore()

function SignIn() {
    const signInWithGoogle = () =>{
      const provider = new firebase.auth.GoogleAuthProvider()
      auth.signInWithPopup(provider)
    }
    return <button onClick={signInWithGoogle}>sign in with google</button>
}
function SignOut() {
    return <button onClick={()=> auth.signOut()}>Sign out</button>
}

export default SignIn