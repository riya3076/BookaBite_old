import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
} from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCUQA_NSeDESD2VN57RHKuOMyUJHOUi9AI",
  authDomain: "bookabite-auth2.firebaseapp.com",
  projectId: "bookabite-auth2",
  storageBucket: "bookabite-auth2.appspot.com",
  messagingSenderId: "21428775249",
  appId: "1:21428775249:web:22e604cbe6414bb9928b70",
};
const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();
export const registerUser = (email, password) => {
  console.log("Registering with user email::" + email);
  return createUserWithEmailAndPassword(auth, email, password);
};
