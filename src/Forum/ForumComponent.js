import { useEffect, useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import { getAuth } from "firebase/auth";
import { collection, doc, addDoc, getDocs, deleteDoc } from "firebase/firestore";

import { db, deleteContent } from "../UserAuth/Firebase.js";

import { store } from "../stores/store";
import { addNotification } from "../Notifications";

import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Typography,
  } from "@mui/material";

export function ForumComponent() {
    const [title, setTitle] = useState("");
    const [post, setPost] = useState("");
    const [postLists, setPostList] = useState([]);
    const auth = getAuth();
    const user = auth.currentUser;
    const dispatch = useDispatch();

    const postCollectionRef = collection(db, "posts");

    const addPost = async () => {
        var date = new Date().toLocaleString();
        await addDoc(postCollectionRef, {
            title:title,
            post:post,
            author:{username: user.displayName, email: user.email},
            datetime: date,
        })
        store.dispatch(
            addNotification({
              message: "Posted successfully!",
              variant: "success",
            })
          );
          setTimeout(() => {
            window.location.reload();
          }, 2500);
    }

    const getPosts = useCallback(async () => {
        const data = await getDocs(postCollectionRef);
        setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }, [user]);

    const deletePost = async (id) => {
        const postDoc = doc(db, "posts", id);
        await deleteDoc(postDoc);
      };

    useEffect(() => {
        getPosts();
      }, [user, getPosts]);


    return (
        <div className="forum">
            <div className="createPostPage" align='center'>
            <div className="cpContainer">
                <h1>Create A Post</h1>
                <div className="inputGp">
                <label> Title:</label>
                <input
                    placeholder="Title"
                    onChange={(event) => {
                    setTitle(event.target.value);
                    }}
                />
                </div>
                <div className="inputGp">
                <label> Post:</label>
                <textarea
                    placeholder="Post"
                    onChange={(event) => {
                    setPost(event.target.value);
                    }}
                />
                </div>
                <button onClick={addPost}> Submit Post</button>
            </div>
            </div>

            <div className="postDisplay" align='center'>
            {postLists.map((post) => {
            return (
            <div className="post">
                <div className="postHeader">
                <div className="title">
                    <h1> {post.title}</h1>
                </div>
                <div className="deletePost">
                    {auth && post.author.id === auth.currentUser.uid && (
                    <button
                        onClick={() => {
                        deletePost(post.id);
                        }}
                    >
                        {" "}
                        &#128465;
                    </button>
                    )}
                </div>
                </div>
                <div className="postTextContainer"> {post.post} </div>
                <h3>@{post.author.username}</h3>
          </div>
        );
      })}
                
            </div>
        </div>
        
    );
    
}