import { Button } from "@mui/base";
import React, { useState } from "react";
import { storage, db } from "./App";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";

import "./ImageUpload.css";

function ImageUpload({ username }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    // This ensures that we get to upload exactly one file.
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  //   const handleUpload = ({ username }) => {
  //     const uploadTask = storage.ref(`images/${image.name}`).put(image);
  //     uploadTask.on(
  //       "state_changed",
  //       (snapshot) => {
  //         // Observe state change events such as progress, pause, and resume
  //         const progress = Math.round(
  //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  //         );
  //         setProgress(progress);
  //       },
  //       (error) => {
  //         // Handle unsuccessful uploads
  //         console.log(error);
  //         alert(error.message);
  //       },
  //       () => {
  //         // Handle successful uploads on complete
  //         // For instance, get the download URL: https://firebasestorage.googleapis.com/...
  //         storage
  //           .ref("images")
  //           .child(image.name)
  //           .getDownloadURL()
  //           .then((downloadURL) => {
  //             setUrl(downloadURL);
  //             // post image into the database
  //             db.collection("Posts").add({
  //               timestamp: serverTimestamp(),
  //               caption: caption,
  //               imageUrl: url,
  //               username: username,
  //             });
  //             setProgress(0);
  //             setCaption("");
  //             setImage(null);
  //           });
  //       }
  //     );
  //   };

  //   const handleUpload = ({ username }) => {
  //     const storageRef = ref(storage, "images/${image.name}");
  //     const postCollectionRef = collection(db, "Posts");

  //     uploadBytes(storageRef, image)
  //       .on("state_changed", (snapshot) => {
  //         // Observe state change events such as progress, pause, and resume
  //         const progress = Math.round(
  //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  //         );
  //         setProgress(progress);
  //       })
  //       .then(() => getDownloadURL(storageRef))
  //       .then((downloadURL) =>
  //         addDoc(postCollectionRef, {
  //           timestamp: serverTimestamp(),
  //           caption: caption,
  //           imageUrl: downloadURL,
  //           username: username,
  //         })
  //       )
  //       .catch((error) => {
  //         console.log(error);
  //       });

  //     setCaption("");
  //     setImage(null);
  //     setProgress(0);
  //   };

  //   firebase snippet for uploading progress
  //   firebase
  //   .storage()
  //   .ref(`images/${directory}/${file.name}`)
  //   .put(file)
  //   .on(
  //     "state_changed",
  //     (snapshot) => {
  //       const progress = Math.round(
  //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  //       );
  //       this.setState({ progress });
  //     },
  //     (error) => this.setState({ error: error.message })
  //   );

  const handleUpload = (e) => {
    e.preventDefault();
    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);
    const postCollectionRef = collection(db, "posts");

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progres = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progres);
        console.log(progres);
      },
      (error) => {
        alert(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            //   setUrl(downloadURL);
            // post image into the database
            addDoc(postCollectionRef, {
              timestamp: serverTimestamp(),
              caption: caption,
              imageUrl: downloadURL,
              username: username,
            });
            setProgress(0);
            setCaption("");
            setImage(null);
          })
          .catch((error) => {
            console.log("Error adding document: ", error.message);
            alert(error.message);
          });
      }
    );
  };

  //   const handleUpload = () => {
  //     const storageRef = ref(storage, `images/${image.name}`);
  //     const postCollectionRef = collection(db, "posts");

  //     // Upload the image to Firebase Storage
  //     const uploadTask = uploadBytes(storageRef, image);

  //     // Capture upload progress
  //     uploadTask.then(() => {
  //       // Upload completed successfully, now we can get the download URL
  //       getDownloadURL(storageRef)
  //         .then((downloadURL) => {
  //           //   setUrl(downloadURL);
  //           // post image into the database
  //           addDoc(postCollectionRef, {
  //             timestamp: serverTimestamp(),
  //             caption: caption,
  //             imageUrl: downloadURL,
  //             username: username,
  //           });
  //           setProgress(0);
  //           setCaption("");
  //           setImage(null);
  //         })
  //         .catch((error) => {
  //           console.log("Error adding document: ", error.message);
  //           alert(error.message);
  //         });
  //     });
  //   };

  return (
    <div className="imageupload">
      {/* caption import */}
      {/* file picker */}
      {/* post button */}
      <progress className="imageupload__progress" value={progress} max={100} />
      <input
        type="text"
        placeholder="Enter a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <input type="file" onChange={handleChange} />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
}

export default ImageUpload;
