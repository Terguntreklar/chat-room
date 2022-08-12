import "./SignOut.css";
import React from "react";
import { auth } from "./firebase";

export function SignOut() {
  return (
    <button className="signout-btn" onClick={() => auth.signOut()}>
      Sign out
    </button>
  );
}
