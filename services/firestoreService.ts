
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  DocumentData,
  QuerySnapshot
} from "firebase/firestore";
import { db, auth } from "./firebaseConfig";

const cleanObject = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') return obj;
  const newObj = Array.isArray(obj) ? [] : {};
  Object.keys(obj).forEach((key) => {
    const val = obj[key];
    if (val === undefined) return;
    if (val && typeof val === "object") {
      (newObj as any)[key] = cleanObject(val);
    } else {
      (newObj as any)[key] = val;
    }
  });
  return newObj;
};

export const getCollectionOnce = async (collectionName: string) => {
  try {
    const q = query(collection(db, collectionName));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    console.error(`Error fetching ${collectionName}:`, error);
    return [];
  }
};

export const getDocumentOnce = async (collectionName: string, docId: string) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { ...snapshot.data(), id: snapshot.id };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching ${collectionName}/${docId}:`, error);
    return null;
  }
};

export const subscribeToCollection = (collectionName: string, callback: (data: any[]) => void) => {
  const q = query(collection(db, collectionName));
  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    callback(data);
  }, (error) => {
    if (error.code !== 'permission-denied') {
      console.error(`Firestore error in ${collectionName}:`, error);
    }
  });
};

export const subscribeToDocument = (collectionName: string, docId: string, callback: (data: any) => void) => {
  return onSnapshot(doc(db, collectionName, docId), (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data());
    }
  });
};

export const upsertDocument = async (collectionName: string, docId: string, data: any) => {
  if (!docId) throw new Error("Document ID is required for upsert operation.");
  
  const currentUser = auth.currentUser;
  console.debug(`[Firestore Upsert] Attempting to save to ${collectionName}/${docId}`);
  console.debug(`[Auth Status] User: ${currentUser?.email || 'Guest'}`);

  try {
    const cleanData = cleanObject(data);
    if (cleanData.id) delete cleanData.id;
    
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, cleanData, { merge: true });
    
    console.debug(`Successfully upserted document ${docId} in ${collectionName}`);
  } catch (error: any) {
    console.error(`Error upserting to ${collectionName}/${docId}:`, error.code, error.message);
    if (error.code === 'permission-denied') {
      console.warn("LƯU Ý: Bạn cần cập nhật Security Rules trong Firebase Console để cho phép quyền ghi.");
    }
    throw error;
  }
};

export const removeDocument = async (collectionName: string, docId: string) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (error: any) {
    console.error("Error deleting document:", error);
    throw error;
  }
};
