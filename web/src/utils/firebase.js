import firebase from 'firebase/app';
import 'firebase/auth';
// import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAidQ4LnvFBCBU6Q1VbTPVivfJZ_E6APbQ",
  authDomain: "quickscan-2f853.firebaseapp.com",
  projectId: "quickscan-2f853",
  storageBucket: "quickscan-2f853.appspot.com",
  messagingSenderId: "361465475773",
  appId: "1:361465475773:web:45dc4aace1a0962ffbbdd4",
  measurementId: "G-V91KRP3H7K"
};

let instance = null;

export default function getFirebase() {
  if (typeof window !== 'undefined') {
    if (instance) return instance;
    instance = firebase.initializeApp(config);
    return instance;
  }

  return null;
}

// const auth = getAuth();
// const provider = new GoogleAuthProvider();
// provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

// const isLoggedIn = () => {
//   return auth.currentUser ? true : false
// }

// const getUserId = () => {
//   if (isLoggedIn()) {
//     return auth.currentUser.uid
//   } else {
//     return false
//   }
// }

// export {auth, db, isLoggedIn, getUserId, provider}