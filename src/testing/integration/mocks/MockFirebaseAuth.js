import EventEmitter from "eventemitter3";
import { mockUser } from "./MockData";

// const authEmitter = new EventEmitter();
// let isSignIn = true;

const mockFirebaseAuth = {
  connectAuthEmulator: jest.fn(),
  getAuth: jest.fn(),
  GoogleAuthProvider: class {},

  currentUser: mockUser,

  onAuthStateChanged: jest.fn((_, fn) => {
    fn(mockUser);
    // authEmitter.on("sign-out", fn, undefined);
    // authEmitter.on("sign-in", fn, mockUser);
  }),
  signOut: jest.fn(() => {
    // isSignIn = false;
    // authEmitter.emit("sign-out");
  }),
  signInWithEmailAndPassword: jest.fn(() => {
    // isSignIn = true;
    // authEmitter.emit("sign-in", mockUser);
    return Promise.resolve(true);
  }),
  sendPasswordResetEmail: jest.fn().mockReturnValue(Promise.resolve(true)),
  sendEmailVerification: jest.fn().mockReturnValue(Promise.resolve(true)),
  signInWithPopup: jest.fn(() => {
    // isSignIn = true;
    // authEmitter.emit("sign-in", mockUser);
    return Promise.resolve(true);
  }),
};

jest.mock("firebase/auth", () => {
  return {
    ...jest.requireActual("firebase/auth"),
    ...mockFirebaseAuth,
  };
});
