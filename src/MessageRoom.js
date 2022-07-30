import React, { useState, useRef, useEffect } from 'react'
import { firestore, auth, firebase } from './firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { SignOut } from './SignOut'

const DBmessages = firestore.collection('messages')
const query = DBmessages.orderBy('timestamp').limit(50)
const converter = {
    fromFirestore(snapshot, options){
        const data = snapshot.data(options)
        return {
            text: data.text,
            displayName: data.displayName,
            timestamp: data.timestamp,
            uid: data.uid,
            photoURL: data.photoURL,
            id: snapshot.id
        }
    }
}
export default function MessageRoom() {
    
    const [messages] = useCollectionData(query.withConverter(converter))
    const scrolldiv = useRef()
    const scrollToBottom = () => {
        scrolldiv.current.scrollIntoView({ behavior: "smooth" })
    }
    useEffect(scrollToBottom, [messages]);
    const [formValue, setFormValue] = useState('')
    const sendMessageToDB = async(e)=>{ 
        e.preventDefault()
        const uid = auth.currentUser.uid
        const photoURL = auth.currentUser.photoURL
        const displayName = auth.currentUser.displayName
        await DBmessages.add({
            text: formValue,
            displayName: displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            uid: uid,
            photoURL: photoURL
        })
        setFormValue('')
        scrollToBottom()
    }
    return (
        <>
        <header><SignOut/></header>
        <section>
            {messages && messages.map((message)=><Message key = {message.id} message = {message}/>)}
            <form onSubmit={sendMessageToDB}>
                <input value={formValue} placeholder={'enter message'} onChange={(e) => setFormValue(e.target.value)}/>
                <button type='submit'>SEND</button>
            </form>
          <div ref={scrolldiv}></div>
        </section>
        </>
    )
}
function Message(props){
    const { text,displayName, timestamp, uid, photoURL } = props.message
    let d = ''
    if (timestamp == null) {
        d = 'just now'
    }
    else{
        d =`${timestamp.toDate().getDate()}/${timestamp.toDate().getMonth()}`
    }
    return (
    <div className={uid===auth.currentUser.uid?'sent-message':'recieved-message'}>
        <img src={photoURL} alt=''></img>
        <p>{displayName}</p>
        <p>{text}</p>
        <p>sent at: {d}</p>
    </div>
    )
}
