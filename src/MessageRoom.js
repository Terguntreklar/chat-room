import "./MessageRoom.css";
import React, { useState, useRef, useEffect } from "react";
import { firestore, auth, firebase, storage } from "./firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";

const DBmessages = firestore.collection("messages");
const query = DBmessages.orderBy("timestamp").limit(50);
const converter = {
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      text: data.text,
      displayName: data.displayName,
      timestamp: data.timestamp,
      uid: data.uid,
      photoURL: data.photoURL,
      downloadURL: data.downloadURL,
      id: snapshot.id,
    };
  },
};
const month = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const imagesRef = storage.ref();

export default function MessageRoom() {
  const [messages] = useCollectionData(query.withConverter(converter));
  const scrolldiv = useRef();
  const imageInput = useRef();
  const [formValue, setFormValue] = useState("");
  const uid = auth.currentUser.uid;
  const photoURL =
    auth.currentUser.photoURL ||
    `https://avatars.dicebear.com/api/human/${uid}.svg`; //HTTP-API, creates unique avatar
  const displayName = auth.currentUser.displayName || "Anonymous user";
  const scrollToBottom = () => {
    scrolldiv.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);
  const imageHandler = async (e) => {
    //uploads image to Storage and creates message
    const uploadTask = imagesRef
      .child("images/" + e.target.files[0].name)
      .put(e.target.files[0]);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      async () => {
        let URL = await imagesRef
          .child("images/" + e.target.files[0].name)
          .getDownloadURL();
        DBmessages.add({
          text: "",
          displayName: displayName,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          uid: uid,
          photoURL: photoURL,
          downloadURL: URL,
        });
      }
    );
  };
  const sendMessageToDB = async (e) => {
    //specifically sends text messages
    e.preventDefault();
    if (formValue.trim() === "") {
      //no whitespace-only messages
      return;
    }
    await DBmessages.add({
      text: formValue,
      displayName: displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      uid: uid,
      photoURL: photoURL,
    });
    setFormValue("");
    scrollToBottom();
  };
  return (
    <>
      <section className="msg-sec">
        {messages &&
          messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          <div ref={scrolldiv}></div>
      </section>
      <div>
        <form className="msg-form" onSubmit={sendMessageToDB}>
          <input
            className="msg"
            value={formValue}
            placeholder={"Enter Message"}
            onChange={(e) => setFormValue(e.target.value)}
          />
          <input
            type="file"
            ref={imageInput}
            style={{ display: "none" }}
            onChange={imageHandler}
          />
          <button className="bton" type="submit">
            <img src="https://img.icons8.com/dusk/344/sent.png" alt=""></img>
          </button>
          <button
            className="bton"
            onClick={(e) => {
              e.preventDefault();
              imageInput.current.click();
            }}
          >
            <img
              alt=""
              src="https://img.icons8.com/external-obvious-flat-kerismaker/344/external-attachment-office-stationery-flat-obvious-flat-kerismaker.png"
            ></img>
          </button>
        </form>
      </div>
    </>
  );
}
function Message(props) {
  const { text, displayName, timestamp, uid, photoURL, downloadURL } =
    props.message;
  let d =
    timestamp == null
      ? "just now"
      : `${timestamp.toDate().getDate()} ${
          month[timestamp.toDate().getMonth()]
        }`;
  let imgDisplay = downloadURL ? { "": "" } : { display: "none" }; //move this to some css file
  return (
    <div
      className={
        uid === auth.currentUser.uid ? "sent message" : "recieved message"
      }
    >
      <div className="user-info">
        <img className="imge" src={photoURL} alt=""></img>
        <p className="name">{displayName}</p>
      </div>
      <div className="details">
        <p className="txt">{text}</p>
        <img
          className="photo"
          src={downloadURL}
          alt=""
          style={imgDisplay}
        ></img>
        <p className="date">{d}</p>
      </div>
    </div>
  );
}
