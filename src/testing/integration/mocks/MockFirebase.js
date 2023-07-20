import "./MockFirebaseAuth";
import "./MockFirestore";

jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
}));

jest.mock("firebase/storage", () => {
  return {
    ...jest.requireActual("firebase/storage"),
    connectStorageEmulator: jest.fn(),
    getStorage: jest.fn(() => ({
      ref: jest.fn(() => ({
        child: jest.fn(() => ({
          put: jest.fn(() => ({
            snapshot: {
              ref: {
                getDownloadURL: jest.fn(),
              },
            },
          })),
        })),
      })),
    })),
  };
});
