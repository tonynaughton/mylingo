import { initializeApp } from "firebase/app";
import _ from "lodash";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import {
  getFirestore,
  CollectionReference,
  DocumentData,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  DocumentReference,
  updateDoc,
  arrayRemove
} from "firebase/firestore";

import { RegisterFormInput } from "../pages/register";
import { AddWordpackInput } from "../pages/add_wordpack";
import { AddWordInput } from "../pages";

export interface Wordpack {
  id: string;
  title: string;
  dateAdded: number;
  description?: string;
}

export interface Word {
  id: string;
  wordpackId: string;
  native: string;
  target: string;
  dateAdded: number;
}

export interface UserData {
  uid: string;
  name: string;
  email: string;
  createdAt: number;
  wordpacks: Wordpack[];
  words: Word[];
  nativeCode: string;
  targetCode: string;
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(db, collectionName) as CollectionReference<T>;
};

export const usersCollection = createCollection<UserData>("users");

export async function registerUser({
  name,
  email,
  password,
  nativeCode,
  targetCode
}: RegisterFormInput): Promise<void> {
  const {
    user: { uid }
  } = await createUserWithEmailAndPassword(auth, email, password);
  await addDoc(usersCollection, {
    uid,
    name,
    email,
    createdAt: Date.now(),
    wordpacks: [],
    words: [],
    nativeCode,
    targetCode
  });
}

async function getUserRef(): Promise<DocumentReference<DocumentData>> {
  const { currentUser } = auth;

  if (!currentUser) {
    throw new Error("No user logged in");
  }

  const userQuery = query(usersCollection, where("uid", "==", currentUser.uid));
  const { docs } = await getDocs(userQuery);

  if (!docs.length) {
    throw new Error("User not found");
  }

  const userId = docs[0].id;
  return doc(db, "users", userId);
}

export async function getUserData(): Promise<UserData> {
  const userRef = await getUserRef();

  const userDoc = await getDoc(userRef);
  return userDoc.data() as UserData;
}

export async function addWordpack(wordpack: AddWordpackInput): Promise<void> {
  const userRef = await getUserRef();

  const userDoc = await getDoc(userRef);
  const userData = userDoc.data() as UserData;

  const { wordpacks } = userData;
  wordpacks.push({ ...wordpack, dateAdded: Date.now(), id: _.uniqueId() });

  await updateDoc(userRef, { wordpacks });
}

export async function addWord(input: AddWordInput): Promise<void> {
  const userRef = await getUserRef();

  const userDoc = await getDoc(userRef);
  const userData = userDoc.data() as UserData;

  const { words } = userData;
  words.push({ ...input, dateAdded: Date.now(), id: _.uniqueId() });

  await updateDoc(userRef, { words });
}

export async function deleteWordpack(wordpack: Wordpack): Promise<void> {
  const userRef = await getUserRef();

  const userDoc = await getDoc(userRef);
  const { words } = userDoc.data() as UserData;

  const filteredWords = words.filter((word) => word.wordpackId !== wordpack.id);

  await updateDoc(userRef, { wordpacks: arrayRemove(wordpack) });
  await updateDoc(userRef, { words: filteredWords });
}

export async function deleteWord(word: Word): Promise<void> {
  const userRef = await getUserRef();

  await updateDoc(userRef, { words: arrayRemove(word) });
}
