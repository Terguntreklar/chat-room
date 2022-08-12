import "./App.css";

import React from "react";
import { auth } from "./firebase";
import { SignIn } from "./SignIn";
import { useAuthState } from "react-firebase-hooks/auth";
import MessageIcon from "@mui/icons-material/Message";
import { pink } from "@mui/material/colors";

import MessageRoom from "./MessageRoom";
import { SignOut } from "./SignOut";
// check https://www.pluralsight.com/guides/setting-up-a-react-project-from-github on how to run this and install necessary files in node_modules
function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="main-title">Chat Room</h1>
        {user ? (
          <SignOut />
        ) : (
          <MessageIcon sx={{ color: pink[500], fontSize: 40 }} />
        )}
      </header>
      <main>
        {user ? (
          <MessageRoom />
        ) : (
          <div className="signin-cont">
            <SignIn />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
