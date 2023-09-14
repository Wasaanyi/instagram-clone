// import firebase from "firebase";

// const firebaseApp = firebase.initializeApp({
//   apiKey: "AIzaSyBTlI9eYRhSskytqwYQShFbpPNQjz3De8A",
//   authDomain: "instagram-clone-react-c4aa6.firebaseapp.com",
//   projectId: "instagram-clone-react-c4aa6",
//   storageBucket: "instagram-clone-react-c4aa6.appspot.com",
//   messagingSenderId: "829013351035",
//   appId: "1:829013351035:web:7caa7ac2fa0d5cb89da0de",
//   measurementId: "G-L3RL7BMY8Z",
// });

// // accessing the db
// const db = firebaseApp.firesotre();

// // accessing authentication
// const auth = firebase.auth();

// // accessing storage endpoints
// const storage = firebase.storage();

// export { db, auth, storage };

// // firebase.js

// import { initializeApp } from "firebase/app";
// import { getStorage } from "firebase/storage";
// import { getDatabase } from "firebase/database";
// import { getAuth } from "firebase/auth"; // Import other Firebase modules as needed

// const firebaseConfig = {
//   apiKey: "AIzaSyBTlI9eYRhSskytqwYQShFbpPNQjz3De8A",
//   authDomain: "instagram-clone-react-c4aa6.firebaseapp.com",
//   projectId: "instagram-clone-react-c4aa6",
//   storageBucket: "instagram-clone-react-c4aa6.appspot.com",
//   messagingSenderId: "829013351035",
//   appId: "1:829013351035:web:7caa7ac2fa0d5cb89da0de",
//   measurementId: "G-L3RL7BMY8Z",
// };

// const app = initializeApp(firebaseConfig);

// // Export the Firebase instances you need
// const auth = getAuth(app);
// const storage = getStorage(app);
// const db = getDatabase(app);

// export { db, auth, storage };

// exporting the configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTlI9eYRhSskytqwYQShFbpPNQjz3De8A",
  authDomain: "instagram-clone-react-c4aa6.firebaseapp.com",
  projectId: "instagram-clone-react-c4aa6",
  storageBucket: "instagram-clone-react-c4aa6.appspot.com",
  messagingSenderId: "829013351035",
  appId: "1:829013351035:web:7caa7ac2fa0d5cb89da0de",
  measurementId: "G-L3RL7BMY8Z",
};

export default firebaseConfig;
