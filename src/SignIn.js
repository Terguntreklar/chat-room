import React from 'react'
import { useState } from 'react';
import { firebase,auth } from './firebase';

export function SignIn() {
    const signInWithGoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider()
      auth.signInWithPopup(provider)
    }

    const [username, setUsername] = useState('');

    const usernameHandler = (e) => {
      setUsername(e.target.value);
    }

    const passwordHandler = (e) => {
      let password = e.target.value;
    }

    const submitHandler = (e) => {
      e.preventDefault();
    }

    return <div className='login-cont'>
      <form>
        <input onChange={usernameHandler} type="text" className='username-inpt' placeholder='Username' />
        <input onChange={passwordHandler} type="password" className='username-inpt' placeholder='Password' />
        <button onSubmit={submitHandler} type='submit'>Submit</button>
      </form>
      <button onClick={signInWithGoogle}>sign in with google</button>
    </div>;
}