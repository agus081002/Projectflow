import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAOn7IyExJ5zV_P03bxb5OuoclgjkJHZHQ",
  authDomain: "manajemen-project-76cb0.firebaseapp.com",
  projectId: "manajemen-project-76cb0",
  storageBucket: "manajemen-project-76cb0.appspot.com",
  messagingSenderId: "405869659056",
  appId: "1:405869659056:web:2e195196518a8bf1a60c75",
  databaseURL: "https://manajemen-project-76cb0-default-rtdb.firebaseio.com",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getDatabase(app);

export { app, auth, db };
