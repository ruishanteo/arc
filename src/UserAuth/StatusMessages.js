const StatusMessages = {
  "auth/wrong-password":
    "Sorry, the password is incorrect. Please recover your password.",
  "auth/user-not-found":
    "Sorry, we couldn't find an account with the email. Please register for an account.",
  "auth/email-already-in-use":
    "There is already an account registered with the email. Please login.",
  "auth/weak-password":
    "Your password is too weak! Please use at least 6 characters.",
  "auth/internal-error": "Please fill in all the fields.",
  "auth/invalid-email":
    "The email entered is invalid. Please enter a valid email.",
  "auth/too-many-requests":
    "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.",
  "permission-denied": "Missing or insufficient permissions",
};

export const getStatusMessage = (errorCode) =>
  StatusMessages[errorCode]
    ? StatusMessages[errorCode]
    : "An unknown error has occurred. Please try again later.";
