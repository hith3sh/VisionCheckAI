import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


const firebaseConfig = {
  apiKey: "AIzaSyBbvsedJBG6pcJ_FsQ4PIbQ-ga6SO9yHek",
  authDomain: "glaucoma-c9752.firebaseapp.com",
  projectId: "glaucoma-c9752",
  storageBucket: "glaucoma-c9752.firebasestorage.app",
  messagingSenderId: "847271799575",
  appId: "1:847271799575:web:55089caa9fdc417d8c6552",
  measurementId: "G-F615ZHW01T"
};
 

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
const db = getFirestore(app);

export { db };
