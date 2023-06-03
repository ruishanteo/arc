import { useEffect, useState } from "react";
import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
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
import { doc, deleteDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { auth, db, googleProvider, storage } from "./Firebase";

import { store } from "../stores/store";
import { addNotification } from "../Notifications";
import { getStatusMessage } from "./StatusMessages";

const handleErrorMessage = (err) => {
  store.dispatch(
    addNotification({
      message: getStatusMessage(err.code),
      variant: "error",
    })
  );
  console.log("Error Code:", err.code, "Message:", err.message);
  throw err;
};

const useSignInWithGoogle = async () => {
  return await signInWithPopup(auth, googleProvider)
    .then(async (res) => {
      store.dispatch(
        addNotification({
          message: "You have successfully logged in.",
          variant: "success",
        })
      );
    })
    .catch(handleErrorMessage);
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
    .catch(handleErrorMessage);
};

const registerWithEmailAndPassword = async (name, email, password) => {
  return name
    ? await createUserWithEmailAndPassword(auth, email, password)
        .then(async (response) => {
          await updateProfile(response.user, { displayName: name });
          store.dispatch(
            addNotification({
              message: "You have successfully registered your account!",
              variant: "success",
            })
          );
        })
        .catch(handleErrorMessage)
    : store.dispatch(
        addNotification({
          message: "Please fill in all the fields!",
          variant: "error",
        })
      );
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
    .catch(handleErrorMessage);
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
    await updateProfile(currentUser, { displayName: username }).catch(
      handleErrorMessage
    );
  }

  if (email) {
    await updateEmail(currentUser, email).catch(handleErrorMessage);
  }

  if (file) {
    const fileRef = ref(storage, currentUser.uid + ".png");
    await uploadBytes(fileRef, file);
    const photoURL = await getDownloadURL(fileRef);
    await updateProfile(currentUser, { photoURL: photoURL }).catch(
      handleErrorMessage
    );
  }

  if (newPassword) {
    updatePassword(currentUser, newPassword).catch(handleErrorMessage);
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

const deleteContent = async (key) => {
  await deleteDoc(doc(db, "assessments", key)).catch(handleErrorMessage);
};

function onDeleteUser(currentUser) {
  deleteContent(currentUser.email);
  setTimeout(() => {
    return deleteUser(currentUser).then(() =>
      store.dispatch(
        addNotification({
          message: "Account is successfully deleted.",
          variant: "success",
        })
      )
    );
  }, 2000);
}

export {
  handleErrorMessage,
  changeProfile,
  deleteContent,
  onDeleteUser,
  onReAuth,
  useSignInWithGoogle as signInWithGoogle,
  useLogInWithEmailAndPassword as logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  useAuth,
};
