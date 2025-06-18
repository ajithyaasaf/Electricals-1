import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// Initialize Firebase Admin SDK
if (!getApps().length) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  initializeApp({
    credential: cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

export const adminDb = getFirestore();
export const adminAuth = getAuth();

// Helper functions for Firestore operations
export const firestoreHelpers = {
  async addDocument(collection: string, data: any) {
    const docRef = await adminDb.collection(collection).add({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: docRef.id, ...data };
  },

  async getDocument(collection: string, id: string) {
    const doc = await adminDb.collection(collection).doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },

  async updateDocument(collection: string, id: string, data: any) {
    await adminDb.collection(collection).doc(id).update({
      ...data,
      updatedAt: new Date(),
    });
    return { id, ...data };
  },

  async deleteDocument(collection: string, id: string) {
    await adminDb.collection(collection).doc(id).delete();
    return true;
  },

  async getDocuments(collection: string, filters?: any) {
    let query = adminDb.collection(collection);
    
    if (filters) {
      Object.entries(filters).forEach(([field, value]) => {
        if (value !== undefined && value !== null) {
          query = query.where(field, "==", value);
        }
      });
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async queryDocuments(collection: string, field: string, operator: any, value: any) {
    const snapshot = await adminDb.collection(collection).where(field, operator, value).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
};
