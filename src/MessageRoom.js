import './MessageRoom.css'
import React, { useState, useRef, useEffect } from 'react'
import { firestore, auth, firebase,storage } from './firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'

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
            downloadURL: data.downloadURL,
            id: snapshot.id
        }
    }
}
const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const imagesRef = storage.ref()

export default function MessageRoom() {
    
    const [messages] = useCollectionData(query.withConverter(converter))
    const scrolldiv = useRef()
    const imageInput = useRef()
    const [formValue, setFormValue] = useState('')
    const [imageURL, setImageURL] = useState('')
    const scrollToBottom = () => {
        scrolldiv.current.scrollIntoView({ behavior: "smooth" })
    }
    useEffect(scrollToBottom, [messages])
    const imageHandler = async(e) =>{
        const uploadTask = imagesRef.child('images/'+ e.target.files[0].name).put(e.target.files[0])
        uploadTask.on(
            "state_changed",
            snapshot => {},
            error => {
                console.log(error)
            },
            () => {
                    imagesRef
                    .child('images/'+ e.target.files[0].name)
                    .getDownloadURL()
                    .then(URL => {
                        setImageURL(URL)
                        console.log('URL created')
                        const uid = auth.currentUser.uid
                        const photoURL = auth.currentUser.photoURL || `https://avatars.dicebear.com/api/human/${uid}.svg`
                        const displayName = auth.currentUser.displayName || 'Anonymous user'
                        DBmessages.add({
                            displayName: displayName,
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            uid: uid,
                            photoURL: photoURL,
                            downloadURL: imageURL
                        })
                        console.log('message sent')
                    })
            }
        )
    }
    const sendMessageToDB = async(e)=>{
        e.preventDefault()
        const uid = auth.currentUser.uid
        const photoURL = auth.currentUser.photoURL || `https://avatars.dicebear.com/api/human/${uid}.svg`
        const displayName = auth.currentUser.displayName || 'Anonymous user'
        if (formValue === '') {
            return
        }
        await DBmessages.add({
            text: formValue,
            displayName: displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            uid: uid,
            photoURL: photoURL,
            downloadURL: imageURL
        })
        setFormValue('')
        setImageURL('')
        scrollToBottom()
    }
    return (
        <>
        {/* <header><SignOut/></header> */}
            <section className='sendMsg'>
            {messages && messages.map((message)=><Message key = {message.id} message = {message}/>)}
            <form onSubmit={sendMessageToDB}>
                <input className='msg' value={formValue} placeholder={'enter message'} onChange={(e) => setFormValue(e.target.value)}/>
                <input 
                    type='file' 
                    ref={imageInput} 
                    style={{display: 'none'}}
                    onChange={imageHandler}
                />
                <button className='bton' onClick={(e)=>{e.preventDefault();imageInput.current.click()}}>ADD IMAGE</button>
                <button className='bton' type='submit'>SEND</button>
            </form>
          <div ref={scrolldiv}></div>
        </section>
        </>
    )
}
function Message(props){
    const { text,displayName, timestamp, uid, photoURL, downloadURL} = props.message
    let d = timestamp==null?'just now':`${timestamp.toDate().getDate()}/${month[timestamp.toDate().getMonth()]}`
    let imgDisplay = (downloadURL==="")?{display: "none"}:{"":""} //move this to some css file
    return (
        <div className={uid===auth.currentUser.uid?'sent message':'recieved message'}>
            <img className='imge' src={photoURL} alt=""></img>
            <div className='details'>
                <p className='name'>{displayName}</p>
                <p className='txt'>{text}</p>
                <img className='photo' src = {downloadURL} alt="" style={imgDisplay} ></img>
                <p className='date'>sent at: {d}</p>
            </div>
        
    </div>
    )
}
