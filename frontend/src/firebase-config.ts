import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBhPiQbIQRF8caeyZMS-PVKjEU5-jn6_KQ",
  authDomain: "concertfriends-a371a.firebaseapp.com",
  projectId: "concertfriends-a371a",
  storageBucket: "concertfriends-a371a.firebasestorage.app",
  messagingSenderId: "1098299441848",
  appId: "1:1098299441848:web:47d11ee8c8178d59bc2a4d"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
