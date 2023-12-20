import { initializeApp } from "firebase/app";
import {
  getAuth,
} from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDHF-AGAWJkTBK7PDa-ECCP5--9WJTOaN4",
  authDomain: "serverless-project-402603.firebaseapp.com",
  projectId: "serverless-project-402603",
  storageBucket: "serverless-project-402603.appspot.com",
  messagingSenderId: "1015588728618",
  appId: "1:1015588728618:web:b09349ae92e07293beb853",
  measurementId: "G-TY99B2LSJ6"
  };
  const firebaseApp = initializeApp(firebaseConfig);
  export const auth = getAuth(firebaseApp);
