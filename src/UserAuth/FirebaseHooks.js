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
import {
  collection,
  doc,
  deleteDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import moment from "moment";

import { auth, db, googleProvider, storage } from "./Firebase";

import { store } from "../stores/store";
import { addNotification } from "../Notifications";
import { getStatusMessage } from "./StatusMessages";

const handleApiCall = async (func) => {
  return func
    .then((res) => res)
    .catch((err) => {
      store.dispatch(
        addNotification({
          message: getStatusMessage(err.code),
          variant: "error",
        })
      );
      console.log("Error Code:", err.code, "Message:", err.message);
      throw err;
    });
};

const convertTimeFromData = (data) => {
  return moment.unix(data.datetime.toDate().getTime() / 1000).fromNow();
};

const useSignInWithGoogle = async () => {
  return await handleApiCall(
    signInWithPopup(auth, googleProvider).then(async (res) => {
      const q = query(
        collection(db, "users"),
        where("uid", "==", res.user.uid)
      );
      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        await setDoc(doc(db, "users", res.user.uid), {
          uid: res.user.uid,
          name: res.user.displayName,
          authProvider: "google",
          email: res.user.email,
          photoURL: res.user.photoURL,
        });
      }

      store.dispatch(
        addNotification({
          message: "You have successfully logged in.",
          variant: "success",
        })
      );
    })
  );
};

const useLogInWithEmailAndPassword = async (email, password) => {
  return await handleApiCall(
    signInWithEmailAndPassword(auth, email, password).then((res) =>
      store.dispatch(
        addNotification({
          message: "You have successfully logged in.",
          variant: "success",
        })
      )
    )
  );
};

const registerWithEmailAndPassword = async (name, email, password) => {
  return name
    ? await handleApiCall(
        createUserWithEmailAndPassword(auth, email, password).then(
          async (response) => {
            await updateProfile(response.user, { displayName: name });
            await setDoc(doc(db, "users", response.user.uid), {
              uid: response.user.uid,
              name,
              authProvider: "local",
              email,
              photoURL: "/static/images/avatar/2.jpg",
            });
            store.dispatch(
              addNotification({
                message: "You have successfully registered your account!",
                variant: "success",
              })
            );
          }
        )
      )
    : store.dispatch(
        addNotification({
          message: "Please fill in all the fields!",
          variant: "error",
        })
      );
};

const sendPasswordReset = async (email) => {
  return await handleApiCall(
    sendPasswordResetEmail(auth, email).then((res) =>
      store.dispatch(
        addNotification({
          message: "Password reset link sent!",
          variant: "success",
        })
      )
    )
  );
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

function updatedParticulars() {
  store.dispatch(
    addNotification({
      message: "You have successfully updated your particulars.",
      variant: "success",
    })
  );
}

async function updateUserDisplayName(user, newDisplayName) {
  await handleApiCall(
    updateProfile(user, { displayName: newDisplayName }).then(async () => {
      updatedParticulars();
      await updateDoc(doc(db, "users", user.uid), { name: newDisplayName });
    })
  );
}

async function updateUserEmail(user, newEmail) {
  await handleApiCall(
    updateEmail(user, newEmail).then(async () => {
      updatedParticulars();
      await updateDoc(doc(db, "users", user.uid), { email: newEmail });
    })
  );
}

async function updateUserPassword(user, newPassword) {
  handleApiCall(updatePassword(user, newPassword).then(updatedParticulars));
}

async function updateUserProfilePicture(user, newProfilePicture) {
  const fileRef = ref(storage, user.uid + ".png");
  await handleApiCall(uploadBytes(fileRef, newProfilePicture));
  const photoURL = await getDownloadURL(fileRef);
  await handleApiCall(updateProfile(user, { photoURL: photoURL })).then(
    async () => {
      updatedParticulars();
      await updateDoc(doc(db, "users", user.uid), {
        photoURL: photoURL,
      });
    }
  );
}

async function onReAuth(user, password) {
  const credential = EmailAuthProvider.credential(user.email, password);
  return await handleApiCall(reauthenticateWithCredential(user, credential));
}

const deleteContent = async (key) => {
  await handleApiCall(deleteDoc(doc(db, "assessments", key)));
  await handleApiCall(deleteDoc(doc(db, "programme", key)));
  await handleApiCall(deleteDoc(doc(db, "semesters", key)));
  await handleApiCall(deleteDoc(doc(db, "users", key)));
};

function onDeleteUser(currentUser) {
  deleteContent(currentUser.uid);
  setTimeout(async () => {
    await handleApiCall(deleteUser(currentUser)).then(() =>
      store.dispatch(
        addNotification({
          message: "Your account has been successfully deleted.",
          variant: "success",
        })
      )
    );
  }, 2000);
}

export {
  handleApiCall,
  convertTimeFromData,
  //
  updateUserDisplayName,
  updateUserEmail,
  updateUserPassword,
  updateUserProfilePicture,
  //
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
