
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { auth } from "./firebaseConfig";

export const loginUser = (email: string, pass: string) => signInWithEmailAndPassword(auth, email, pass);
export const registerUser = (email: string, pass: string) => createUserWithEmailAndPassword(auth, email, pass);
export const logoutUser = () => signOut(auth);
export const onAuthUpdate = (callback: (user: FirebaseUser | null) => void) => onAuthStateChanged(auth, callback);
