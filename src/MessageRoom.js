import './MessageRoom.css'
import React, { useState, useRef, useEffect } from 'react'
import { firestore, auth, firebase,storage } from './firebase'
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
        window.alert("image uploading, please wait for confirmation, I don't know how to make a progressbar 😒")
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
                        console.log("this works")
                        window.alert("image uploaded, you may send your image!😏 ")

                    })
            }
        )
    }
    const sendMessageToDB = async(e)=>{
        e.preventDefault()
        const uid = auth.currentUser.uid
        const photoURL = auth.currentUser.photoURL
        const displayName = auth.currentUser.displayName
        if (formValue === ' ' &&  imageURL === '') {
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
            <section className='msg-sec'>
            {messages && messages.map((message)=><Message key = {message.id} message = {message}/>)}
            <form className='msg-form' onSubmit={sendMessageToDB}>
                <input className='msg' value={formValue} placeholder={'Enter Message'} onChange={(e) => setFormValue(e.target.value)}/>
                <input 
                    type='file' 
                    ref={imageInput} 
                    style={{display: 'none'}}
                    onChange={imageHandler}
                />
                <button className='bton' type='submit'><img src='https://img.icons8.com/dusk/344/sent.png'></img></button>
                <button className='bton' onClick={(e)=>{e.preventDefault();imageInput.current.click()}}><img src='https://img.icons8.com/external-obvious-flat-kerismaker/344/external-attachment-office-stationery-flat-obvious-flat-kerismaker.png'></img></button>
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
        <div className={uid === auth.currentUser.uid ? 'sent message' : 'recieved message'}>
            <div className='user-info'>
                <img className='imge' src={photoURL} alt=""></img>
                <p className='name'>{displayName}</p>
            </div>
            <div className='details'>
                <p className='txt'>{text}</p>
                <img className='photo' src = {downloadURL} alt="" style={imgDisplay} ></img>
                <p className='date'>Sent At: {d}</p>
            </div>
        
    </div>
    )
}
