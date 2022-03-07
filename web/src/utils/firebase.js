// import firebase from 'gatsby-plugin-firebase';
// // import { initializeApp } from 'gatsby-plugin-firebase/app';
// // import { getAuth, GoogleAuthProvider } from "gatsby-plugin-firebase/auth";

// // TODO: Replace the following with your app's Firebase project configuration

// const getFirebase = () => {
//   if (typeof window !== 'undefined') {
//     if (instance) return instance;
//     instance = firebase.initializeApp(firebaseConfig);
//     return instance;
//   }

//   return null;
// }

// const app = getFirebase();

// const auth = app.auth.getAuth();
// const provider = new app.auth.GoogleAuthProvider();
// provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

// const signInWithEmailAndPassword = app.auth.signInWithEmailAndPassword
// const signInWithRedirect = app.auth.signInWithRedirect

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

// export {auth, isLoggedIn, getUserId, provider, signInWithEmailAndPassword, signInWithRedirect}