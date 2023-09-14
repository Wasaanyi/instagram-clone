import React, { useEffect, useState } from "react";
import "./Post.css";
import { Avatar, snackbarClasses } from "@mui/material";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./App";

function Post({ userName, user, postId, caption, imageUrl }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState([]);

  useEffect(() => {
    const postRef = collection(db, "posts");
    const specificPostRef = doc(postRef, postId);
    const commentsRef = collection(specificPostRef, "comments");

    const commentsQuery = query(commentsRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
      const updatedComments = [];

      snapshot.forEach((doc) => {
        updatedComments.push({
          id: doc.id,
          ...doc.data(),
        });

        setComments(updatedComments);
      });
    });

    return () => unsubscribe();
  }, [postId]);

  const postComment = async (event) => {
    event.preventDefault();

    if (comment.trim() === "") {
      return; // Don not add an empty comment
    }

    try {
      const commentsRef = collection(db, "posts", postId, "comments");
      await addDoc(commentsRef, {
        text: comment,
        username: user.displayName,
        timestamp: serverTimestamp(),
      });
      setComment([]);
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          alt={userName}
          className="post__avatar"
          src="/static/images/avatar/1.jpg"
        />
        <h3>{userName}</h3>
      </div>

      {/* header -> avatar + username */}
      <img className="post__image" src={imageUrl} alt="userImage" />
      {/* image */}

      <h4 className="post__text">
        <strong>{userName}</strong> {caption}
      </h4>

      {comments.length !== 0 && (
        <div className="post__comments">
          {comments.map((com) => (
            <p key={com.id}>
              <strong>{com.username}</strong> {com.text}
            </p>
          ))}
        </div>
      )}

      {user && (
        <form className="post__commentBox">
          <input
            className="post__input"
            type="text"
            placeholder="Add a comment... "
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            onClick={postComment}
            className="post__button"
            disabled={!comment}
            type="submit"
          >
            Post
          </button>
        </form>
      )}

      {/* username + caption */}
    </div>
  );
}

export default Post;
