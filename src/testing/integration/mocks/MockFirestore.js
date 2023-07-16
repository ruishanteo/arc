import { getMockData } from "./MockData";

export const mockDB = getMockData();

const wrapResponse = (response) => {
  return {
    data: jest.fn().mockReturnValue(response),
    exists: jest.fn().mockReturnValue(response !== undefined),
    id: response?.id,
  };
};

const wrapResponses = (responses) => {
  return {
    docs: responses.map(wrapResponse),
    exists: jest.fn().mockReturnValue(responses.length > 0),
  };
};

const getAndWrapResponses = (ref) => {
  return wrapResponses(mockDB[ref]);
};

const getAndWrapResponse = (ref, id) => {
  const filtered = mockDB[ref].filter((doc) => doc.id === id);
  return wrapResponse(filtered.length > 0 ? filtered[0] : undefined);
};

const mockedAddDoc = (ref, data) => {
  mockDB[ref].push(data);
  return Promise.resolve();
};

const mockedSetDoc = (args, data) => {
  const ref = args[0];
  const id = args[1];
  mockDB[ref].push({ ...data, id: id });
  return Promise.resolve();
};

const mockedGetDoc = (args) => {
  const ref = args[0];
  const id = args[1];
  return Promise.resolve(getAndWrapResponse(ref, id));
};
const mockedGetDocs = (ref) => Promise.resolve(getAndWrapResponses(ref));

const mockedUpdateDoc = (args, data) => {
  const ref = args[0];
  const id = args[1];
  mockDB[ref] = mockDB[ref].map((doc) => (doc.id === id ? data : doc));
  return Promise.resolve();
};

const mockedDeleteDoc = (args) => {
  const ref = args[0];
  const id = args[1];
  mockDB[ref] = mockDB[ref].filter((doc) => doc.id !== id);
  return Promise.resolve();
};

const mockedCollection = (_, ref) => ref;
const mockedDoc = (_, ref, id) => [ref, id];
const mockedQuery = (ref) => ref;

const mockedTimestamp = {
  fromDate: (date) => ({
    toDate: () => ({
      getTime: () => date.getTime(),
      toString: () => date.toString(),
    }),
  }),
};

jest.mock("firebase/firestore", () => {
  return {
    ...jest.requireActual("firebase/firestore"),
    connectFirestoreEmulator: jest.fn(),
    getFirestore: jest.fn(),

    addDoc: jest.fn().mockImplementation(mockedAddDoc),
    setDoc: jest.fn().mockImplementation(mockedSetDoc),
    deleteDoc: jest.fn(mockedDeleteDoc),
    getDoc: jest.fn().mockImplementation(mockedGetDoc),
    getDocs: jest.fn().mockImplementation(mockedGetDocs),
    updateDoc: jest.fn().mockImplementation(mockedUpdateDoc),
    collection: jest.fn().mockImplementation(mockedCollection),
    doc: jest.fn().mockImplementation(mockedDoc),

    query: jest.fn().mockImplementation(mockedQuery),
    Timestamp: mockedTimestamp,
    orderBy: jest.fn(),
    where: jest.fn(),
  };
});
