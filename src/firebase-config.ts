// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkvdzl6gC2JAv8peTEhQRQ6ZzsagVGHsg",
  authDomain: "chuck-chat-97515.firebaseapp.com",
  projectId: "chuck-chat-97515",
  storageBucket: "chuck-chat-97515.appspot.com",
  messagingSenderId: "298841644909",
  appId: "1:298841644909:web:864744fb61895ab3434464"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()

export const db = getFirestore(app)