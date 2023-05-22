import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
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
import { getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import { store } from "../stores/store";
import { addNotification } from "../Notifications";
import { getStatusMessage } from "./StatusMessages";

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
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage();

const googleProvider = new GoogleAuthProvider();

const handleErrorMessage = (err) => {
  store.dispatch(
    addNotification({
      message: getStatusMessage(err.code),
      variant: "error",
    })
  );
  console.log(err.message);
};

const useSignInWithGoogle = async () => {
  return await signInWithPopup(auth, googleProvider)
    .then((res) =>
      store.dispatch(
        addNotification({
          message: "You have successfully logged in.",
          variant: "success",
        })
      )
    )
    .catch((err) => handleErrorMessage(err));
};

const useLogInWithEmailAndPassword = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password)
    .then((res) =>
      store.dispatch(
        addNotification({
          message: "You have successfully logged in.",
          variant: "success",
        })
      )
    )
    .catch((err) => handleErrorMessage(err));
};

const registerWithEmailAndPassword = async (name, email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password)
    .then((response) => {
      store.dispatch(
        addNotification({
          message: "You have successfully registered your account!",
          variant: "success",
        })
      );
      updateProfile(response.user, { displayName: name });
    })
    .catch((err) => handleErrorMessage(err));
};

const sendPasswordReset = async (email) => {
  return await sendPasswordResetEmail(auth, email)
    .then((res) =>
      store.dispatch(
        addNotification({
          message: "Password reset link sent!",
          variant: "success",
        })
      )
    )
    .catch((err) => handleErrorMessage(err));
};

const logout = () => {
  return signOut(auth).then((res) =>
    store.dispatch(
      addNotification({
        message: "You have logged out.",
        variant: "success",
      })
    )
  );
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

  if (username) {
    await updateProfile(currentUser, { displayName: username }).catch((err) =>
      handleErrorMessage(err)
    );
  }

  if (email) {
    await updateEmail(currentUser, email).catch((err) =>
      handleErrorMessage(err)
    );
  }

  if (file) {
    const fileRef = ref(storage, currentUser.uid + ".png");
    await uploadBytes(fileRef, file);
    const photoURL = await getDownloadURL(fileRef);
    await updateProfile(currentUser, { photoURL: photoURL }).catch((err) =>
      handleErrorMessage(err)
    );
  }

  if (newPassword) {
    updatePassword(currentUser, newPassword).catch((err) =>
      handleErrorMessage(err)
    );
  }

  setLoading(false);
}

async function onReAuth(password, email, currentUser) {
  const credential = EmailAuthProvider.credential(email, password);
  return await reauthenticateWithCredential(currentUser, credential)
    .then(() => {})
    .catch((err) => {
      handleErrorMessage(err);
      return "err";
    });
}

function onDeleteUser(currentUser) {
  return deleteUser(currentUser).then(() =>
    store
      .dispatch(
        addNotification({
          message: "Account is successfully deleted.",
          variant: "success",
        })
      )
      .then((err) => handleErrorMessage(err))
  );
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
