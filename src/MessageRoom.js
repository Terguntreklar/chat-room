import React, { useState, useRef, useEffect } from 'react'
import { firestore, auth, firebase,storage } from './firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import SendIcon from '@mui/icons-material/Send';

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

const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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
    useEffect(scrollToBottom, [messages]);
    const [formValue, setFormValue] = useState('')
    const sendMessageToDB = async(e)=>{
    useEffect(scrollToBottom, [messages])
    const imageHandler = async(e) =>{
        window.alert("image uploading, please wait for confirmation, I don't know how to make a progressbar 😒")
        const uploadTask = imagesRef.child('images/'+ e.target.files[0].name).put(e.target.files[0])
        uploadTask.on(
            "state_changed",
            snapshot => {},
            error => {
                console.log(error);
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
        if (formValue === '') {
            return;
        }
        await DBmessages.add({
            text: formValue,
            displayName: displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            uid: uid,
            photoURL: photoURL,
        });
        setFormValue('');
        scrollToBottom();
    }
    return (
        <section className='msg-sec'>
            <div className='msg-cont'>
                {messages && messages.map((message)=><Message key = {message.id} message = {message}/>)}
            </div>
            <div className='msg-form'>
                <form onSubmit={sendMessageToDB}>
                    <input value={formValue} placeholder={'enter message'} onChange={(e) => setFormValue(e.target.value)}/>
                    <button className='send-btn' type='submit'> <SendIcon /> </button>
                </form>
            </div>
            downloadURL: imageURL
        })
        setFormValue('')
        setImageURL('')
        scrollToBottom()
    }
    return (
        <>
        <header><SignOut/></header>
        <section>
            {messages && messages.map((message)=><Message key = {message.id} message = {message}/>)}
            <form onSubmit={sendMessageToDB}>
                <input value={formValue} placeholder={'enter message'} onChange={(e) => setFormValue(e.target.value)}/>
                <input 
                    type='file' 
                    ref={imageInput} 
                    style={{display: 'none'}}
                    onChange={imageHandler}
                />
                <button onClick={(e)=>{e.preventDefault();imageInput.current.click()}}>ADD IMAGE</button>
                <button type='submit'>SEND</button>
            </form>
          <div ref={scrolldiv}></div>
        </section>
    )
}
function Message(props){
    const { text,displayName, timestamp, uid, photoURL } = props.message
    let d = ''
    if (timestamp == null) {
        d = 'just now'
    }
    else{
        d =`${timestamp.toDate().getDate()}/${month[timestamp.toDate().getMonth()]}`;
    }
    const { text,displayName, timestamp, uid, photoURL, downloadURL} = props.message
    let d = timestamp==null?'just now':`${timestamp.toDate().getDate()}/${timestamp.toDate().getMonth()}`
    let imgDisplay = (downloadURL==="")?{display: "none"}:{"":""} //move this to some css file
    return (
        <div className={uid===auth.currentUser.uid?'sent-message':'recieved-message'}>
        <img src={photoURL} alt=""></img>
        <p>{displayName}</p>
        <p>{text}</p>
        <img src = {downloadURL} alt="" style={imgDisplay} ></img>
        <p>sent at: {d}</p>
    </div>
    )
}
