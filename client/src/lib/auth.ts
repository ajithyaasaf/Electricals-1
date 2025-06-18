import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { insertUserSchema, type User as AppUser } from "@shared/schema";

const googleProvider = new GoogleAuthProvider();

export const signIn = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signUp = async (email: string, password: string, displayName?: string) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  
  if (displayName && result.user) {
    await updateProfile(result.user, { displayName });
  }
  
  // Create user document in Firestore
  if (result.user) {
    await createUserDocument(result.user, { displayName });
  }
  
  return result;
};

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  
  // Create user document if it doesn't exist
  if (result.user) {
    await createUserDocument(result.user);
  }
  
  return result;
};

export const logout = () => {
  return signOut(auth);
};

export const createUserDocument = async (user: User, additionalData?: any) => {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    const userData = {
      email: user.email!,
      displayName: user.displayName || additionalData?.displayName || "",
      phoneNumber: user.phoneNumber || "",
      role: "user" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await setDoc(userRef, userData);
  }
};

export const getUserDocument = async (uid: string): Promise<AppUser | null> => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: uid, ...userSnap.data() } as AppUser;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching user document:", error);
    return null;
  }
};
