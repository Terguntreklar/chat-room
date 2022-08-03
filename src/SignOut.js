import React from 'react'
import {firebase, auth} from './firebase'

export function SignOut() {
    return <button onClick={()=> auth.signOut()}>Sign out</button>
}