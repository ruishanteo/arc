// Import the functions you need from the SDKs you need
import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import {
  AuthErrorCodes,
  EmailAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import { store } from "../stores/store";
import { addNotification } from "../Notifications";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsg7SU5SlU8QMus3pGkE5wbUyBzL8ur5k",
  authDomain: "orbital-96ac8.firebaseapp.com",
  projectId: "orbital-96ac8",
  storageBucket: "orbital-96ac8.appspot.com",
  messagingSenderId: "751532494109",
  appId: "1:751532494109:web:50427f42f31f040bb3e5f4",
  measurementId: "G-7C3QV4XQBH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage();

const googleProvider = new GoogleAuthProvider();

const useSignInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
        photoURL: user.photoURL,
      });
    }
  } catch (err) {
    let message = "";

    if (err.code === AuthErrorCodes.INVALID_PASSWORD) {
      message =
        "Sorry, the password is incorrect. Please recover your password.";
    } else if (err.code === AuthErrorCodes.USER_DELETED) {
      message =
        "Sorry, we couldn't find an account with the email. Please register for an account.";
    } else {
      message = "An unknown error has occurred. Please try again later.";
    }

    store.dispatch(
      addNotification({
        message: message,
        variant: "error",
      })
    );
    console.log(err.message);
  }
};

const useLogInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    let message = "";

    if (err.code === AuthErrorCodes.INVALID_PASSWORD) {
      message =
        "Sorry, the password is incorrect. Please recover your password.";
    } else if (err.code === AuthErrorCodes.USER_DELETED) {
      message =
        "Sorry, we couldn't find an account with the email. Please register for an account.";
    } else {
      message = "An unknown error has occurred. Please try again later.";
    }

    store.dispatch(
      addNotification({
        message: message,
        variant: "error",
      })
    );
    console.log(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
      photoURL: "/static/images/avatar/2.jpg",
    });
  } catch (err) {
    let message = "";

    if (err.code === AuthErrorCodes.EMAIL_EXISTS) {
      message =
        "There is already an account registered with the email. Please login.";
    } else if (err.code === AuthErrorCodes.WEAK_PASSWORD) {
      message = "Your password is too weak! Please use at least 6 characters.";
    } else if (err.code === AuthErrorCodes.INVALID_EMAIL) {
      message = "The email entered is invalid. Please enter a valid email.";
    } else if (err.code === AuthErrorCodes.INTERNAL_ERROR) {
      message = "Please fill in all the fields.";
    } else {
      message = "An unknown error has occurred. Please try again later.";
    }
    store.dispatch(
      addNotification({
        message: message,
        variant: "error",
      })
    );
    console.log(err.message);
  }
};

const sendPasswordReset = async (email) => {
  let message = "";
  try {
    await sendPasswordResetEmail(auth, email);
    message = "Password reset link sent!";
    store.dispatch(
      addNotification({
        message: message,
        variant: "success",
      })
    );
  } catch (err) {
    if (err.code === AuthErrorCodes.WEAK_PASSWORD) {
      message =
        "Password entered is too weak. Please enter a password with at least 6 characters.";
    } else {
      message = "An unknown error has occurred. Please try again later.";
    }
    store.dispatch(
      addNotification({
        message: message,
        variant: "error",
      })
    );
    console.log(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

function useAuth() {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return unsub;
  }, []);

  return currentUser;
}

async function changeProfile(
  file,
  username,
  email,
  newPassword,
  currentUser,
  setLoading
) {
  setLoading(true);
  let message = "Change success!";
  let severity = "success";

  if (username) {
    await updateProfile(currentUser, { displayName: username });
  }

  if (email) {
    try {
      await updateEmail(currentUser, email);
    } catch (err) {
      if (err.code === AuthErrorCodes.EMAIL_EXISTS) {
        message =
          "There is already an account registered with the email. Please login.";
      }
      if (err.code === AuthErrorCodes.INVALID_EMAIL) {
        message = "The email entered is invalid. Please enter a valid email.";
      } else {
        message = "An unknown error has occurred. Please try again later.";
      }
      severity = "error";
    }
  }

  if (file) {
    const fileRef = ref(storage, currentUser.uid + ".png");
    await uploadBytes(fileRef, file);
    const photoURL = await getDownloadURL(fileRef);
    await updateProfile(currentUser, { photoURL: photoURL });
  }

  if (newPassword) {
    try {
      await updatePassword(currentUser, newPassword);
    } catch (err) {
      if (err.code === AuthErrorCodes.WEAK_PASSWORD) {
        message =
          "Password entered is too weak. Please enter a password with at least 6 characters.";
      } else {
        message = "An unknown error has occurred. Please try again later.";
      }
      severity = "error";
    }
  }

  store.dispatch(
    addNotification({
      message: message,
      variant: severity,
    })
  );

  setLoading(false);
}

async function onReAuth(password, email, currentUser) {
  const credential = EmailAuthProvider.credential(email, password);

  return await reauthenticateWithCredential(currentUser, credential)
    .then(() => {})
    .catch((err) => {
      store.dispatch(
        addNotification({
          message: "Password entered is incorrect. Please try again.",
          variant: "error",
        })
      );
      return "err";
    });
}

function onDeleteUser(currentUser) {
  deleteUser(currentUser);
}

export {
  auth,
  db,
  storage,
  changeProfile,
  onDeleteUser,
  onReAuth,
  useSignInWithGoogle as signInWithGoogle,
  useLogInWithEmailAndPassword as logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  useAuth,
};
