import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, User } from "firebase/auth";
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
  updateDoc
} from "firebase/firestore";

import { RegisterFormInput } from "../pages/register";

export interface WordData {
  spanish: string;
  english: string;
}

export interface UserData {
  uid: string;
  name: string;
  email: string;
  createdAt: number;
  savedWords: WordData[];
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

export async function registerUser({ name, email, password }: RegisterFormInput): Promise<void> {
  const {
    user: { uid }
  } = await createUserWithEmailAndPassword(auth, email, password);
  await addDoc(usersCollection, {
    uid,
    name,
    email,
    createdAt: Date.now(),
    savedWords: []
  });
}

export async function getUserRef(user: User): Promise<DocumentReference<DocumentData>> {
  const userQuery = query(usersCollection, where("uid", "==", user.uid));
  const { docs } = await getDocs(userQuery);

  if (!docs.length) {
    throw new Error("User not found");
  }

  const userId = docs[0].id;
  return doc(db, "users", userId);
}

export async function addSavedWord(wordData: WordData): Promise<void> {
  const { currentUser } = auth;

  if (!currentUser) {
    throw new Error("No user logged in");
  }

  const userRef = await getUserRef(currentUser);

  const userDoc = await getDoc(userRef);
  const userData = userDoc.data() as UserData;

  const savedWords = userData.savedWords;
  savedWords.push(wordData);

  await updateDoc(userRef, { savedWords });
}

export async function getSavedWords(): Promise<WordData[]> {
  const { currentUser } = auth;

  if (!currentUser) {
    throw new Error("No user logged in");
  }

  const userRef = await getUserRef(currentUser);

  const userDoc = await getDoc(userRef);
  const userData = userDoc.data() as UserData;

  return userData.savedWords;
}
