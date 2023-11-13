import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAj6nTLoKvgczYU2t7fFbD2it7bgJfdhy8",
  authDomain: "quill-app-157bb.firebaseapp.com",
  projectId: "quill-app-157bb",
  storageBucket: "quill-app-157bb.appspot.com",
  messagingSenderId: "262382241699",
  appId: "1:262382241699:web:60ad16108ec97c265b3c16",
  measurementId: "G-XH03F52K8Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)