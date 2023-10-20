// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFI6304u4EwkaX7tLO9hflFPDaEp8-ZF0",
  authDomain: "practicaprofesional-lunam.firebaseapp.com",
  projectId: "practicaprofesional-lunam",
  storageBucket: "practicaprofesional-lunam.appspot.com",
  messagingSenderId: "678566769635",
  appId: "1:678566769635:web:4f39837a92253ad14ee6d6"
};
// Initialize Firebase
export const Firebase_APP = initializeApp(firebaseConfig);

export const Firebase_AUTH = getAuth(Firebase_APP);

export const Firestore_DB = getFirestore(Firebase_APP);
