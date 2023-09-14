import "./App.css";
import Post from "./Post";
import logo from "./instagram.png";
import reactLogo from "./logo.svg";
import { useState, useEffect } from "react";

import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

// Import your Firebase configuration
import firebaseConfig from "./firebase"; // Make sure to create this file with your Firebase configuration
import {
  Box,
  Button,
  Fade,
  Modal,
  Typography,
  Backdrop,
  Input,
} from "@mui/material";
import { handleBreakpoints } from "@mui/system";
import ImageUpload from "./ImageUpload";

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Authentication
const auth = getAuth(app);

// Firestore
export const db = getFirestore(app);

// Storage
export const storage = getStorage(app);

// modal styles
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function App() {
  // an example of a hook
  const [posts, setPosts] = useState([]);

  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  // useEffect in this case is listening for changes on the frontend and onAuthStateChange is listening for
  // changes on the backend.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // user has logged in ...
        // console.log(authUser.displayName);
        setUser(authUser);
        // console.log(user);
      } else {
        // user has logged out ...
        setUser(null);
      }
    });

    return () => {
      // perform some cleanup action
      unsubscribe();
    };
  }, [user, username]);

  // useEffect -> Runs a piece of code based on a specific condition
  // if condition block is left null it runs once when the component loads.
  useEffect(() => {
    // // this is where the code runs
    // db.collection("posts").onSnapshot((snapshot) => {
    //   // every time a new post is added, this code fires
    //   setPosts(snapshot.docs.map((doc) => doc.data()));
    // });

    // This code is fired every time a post is fired
    // getDocs(collection(db, "posts")).then((snapshot) => {
    //   setPosts(snapshot.docs.map((doc) => doc.data()));
    // });

    const unsubscribe = onSnapshot(
      query(collection(db, "posts"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
      }
    );
  }, []);

  const signUp = (event) => {
    event.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        // const user = userCredential.user;
        // console.log(user);
        setUser(userCredential.user);

        // updating the user display name
        updateProfile(userCredential.user, { displayName: username });
      })
      .catch((error) => {
        alert(`ERROR: ${error.code}`);
      });

    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        setUser(userCredential.user);
      })
      .catch((error) => {
        alert(`ERROR: ${error.code}`);
      });

    setOpenSignIn(false);
  };

  return (
    <div className="app">
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <form className="app__signup">
              <center>
                <img
                  className="app_headerImage"
                  // src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXm8H7K0a-4nYAwKUu57KI463WaS6BGR7NlFQT5jx05FUdK36UdWbyVyhJaQp6hZAMafM&usqp=CAU"
                  src={logo}
                  height={23}
                  width={103}
                  alt="instagram-logo"
                />
              </center>
              <Input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <Input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button type="submit" onClick={signUp}>
                Sign Up
              </Button>
            </form>
          </Box>
        </Fade>
      </Modal>

      {/* sign in modal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openSignIn}>
          <Box sx={style}>
            <form className="app__signup">
              <center>
                <img
                  className="app_headerImage"
                  // src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXm8H7K0a-4nYAwKUu57KI463WaS6BGR7NlFQT5jx05FUdK36UdWbyVyhJaQp6hZAMafM&usqp=CAU"
                  src={logo}
                  height={23}
                  width={103}
                  alt="instagram-logo"
                />
              </center>

              <Input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button type="submit" onClick={signIn}>
                Sign In
              </Button>
            </form>
          </Box>
        </Fade>
      </Modal>

      <div className="app__header">
        <img
          className="app_headerImage"
          // src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXm8H7K0a-4nYAwKUu57KI463WaS6BGR7NlFQT5jx05FUdK36UdWbyVyhJaQp6hZAMafM&usqp=CAU"
          src={logo}
          height={23}
          width={103}
          alt="instagram-logo"
        />

        {user ? (
          <Button onClick={() => signOut(auth)}>Logout</Button>
        ) : (
          <div className="">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      <div className="app__posts">
        <div className="app__postsleft">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              userName={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
        <div className="app__postsright">{/* <h2>Right Section</h2> */}</div>
      </div>

      {/* <Post userName="JamesWasaanyi" imageUrl={logo} caption="WOW it works" />
      <Post userName="AlexMatove" imageUrl={reactLogo} caption="Awesome!" />
      <Post
        userName="CK-coco"
        imageUrl={reactLogo}
        caption="This is a fun projects"
      /> */}

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry you need to login to upload</h3>
      )}
    </div>
  );
}

export default App;
