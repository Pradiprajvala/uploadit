// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBasH-rn-kUBNBHCV7Tp5phMLVVO4f9d6w",
  authDomain: "fir-e687b.firebaseapp.com",
  projectId: "fir-e687b",
  storageBucket: "fir-e687b.appspot.com",
  messagingSenderId: "410289386359",
  appId: "1:410289386359:web:fb26302543a84a361c6772",
  measurementId: "G-P045S8MLTK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage, app };
