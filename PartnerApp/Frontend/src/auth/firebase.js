import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
} from "firebase/auth";
const firebaseConfig = {

  apiKey: "AIzaSyB0ddbrrWFX7X4ObMK70PhyK2Opex8gxeI",

  authDomain: "serverless-402614.firebaseapp.com",

  projectId: "serverless-402614",

  storageBucket: "serverless-402614.appspot.com",

  messagingSenderId: "455146320648",

  appId: "1:455146320648:web:f58372a0661b0c555772bd"

};

const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();
export const registerUser = (email, password) => {
  console.log("Registering with user email::" + email);
  return createUserWithEmailAndPassword(auth, email, password);
};
