import { FirebaseApp } from '@angular/fire/app';
import { Injectable } from '@angular/core';
import { getApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { doc, setDoc, collection, getFirestore, addDoc, getDocs, deleteDoc, writeBatch } from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class DatabaseConnectionService {

async deleteDocument(documentId: string) {
  const db = getFirestore(getApp());
  const userId = getAuth().currentUser?.uid;
  const collectionName = "collections";
  const documentRef = doc(db, `users/${userId}/${collectionName}/${documentId}`);
  await deleteDoc(documentRef);
}

 async dropCollection(collectionName: string) {
  const db = getFirestore(getApp());
  const userId = getAuth().currentUser?.uid;
  const collectionRef = collection(db, `users/${userId}/${collectionName}`);
  const batch = writeBatch(db);

  const documentsSnapshot = await getDocs(collectionRef);
  documentsSnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
}

  constructor(private app: FirebaseApp) { }

  async fetchDocuments(collectionName: string | null) {
    const db = getFirestore(getApp());
    const userId = getAuth().currentUser?.uid;
    const documentsRef = collection(db, `users/${userId}/${collectionName}`);
    const documentsSnapshot = await getDocs(documentsRef);

    const documents: any = [];
    documentsSnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return documents;
  }

  async updateDocument(collectionName: string | null, id: string, title: string, transcription: string) {
    const db = getFirestore(getApp());
    const userId = getAuth(this.app).currentUser?.uid;
    const docRef = doc(db, `users/${userId}/${collectionName}/${id}`);


    try {
      await setDoc(docRef, { title: title, transcription: transcription }, { merge: true });
      console.log(`Document with ID ${id} updated successfully.`);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  }


  async saveAudioIntoDB(transcription: string, title: string, audio: Blob, collectionName: string | null) {
    const db = getFirestore(getApp());
    const userId = getAuth(this.app).currentUser?.uid;

    // Convert the audio blob to a base64 string
    const reader = new FileReader();
    reader.readAsDataURL(audio);
    reader.onload = async () => {
      const audioData = {
        title: title,
        transcription: transcription,
        audio: reader.result as string // This will be the base64 string
      };

      // Save the audio data to Firestore
      await addDoc(collection(db, `users/${userId}/${collectionName}`), audioData);
    };
  }

  async deleteItemFromDB(id: string, collectionName: string | null) {
    const db = getFirestore(getApp());
    const userId = getAuth(this.app).currentUser?.uid;
    const docRef = doc(db, `users/${userId}/${collectionName}/${id}`);

    try {
      await deleteDoc(docRef);
      console.log(`Document with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  }

  async createCollection(collectionName: string) {
    const db = getFirestore(getApp());
    const userId = getAuth(this.app).currentUser?.uid;
    const userCollectionRef = doc(db, `users/${userId}`);
    const newCollectionRef = collection(userCollectionRef, collectionName);
    try {
      await setDoc(doc(db, `users/${userId}/collections/${collectionName}`), {});
      await addDoc(newCollectionRef, {});
      console.log(`Collection ${collectionName} created successfully.`);
    } catch (error) {
      console.error("Error creating collection: ", error);
    }
  }

  // Fetches all the collections the user has so he can route to them
  async fetchUserCollectionNames() {
    const db = getFirestore(getApp());
    const userId = getAuth().currentUser?.uid;
    const collectionsRef = collection(db, `users/${userId}/collections`);
    const documentsSnapshot = await getDocs(collectionsRef);


    const title: string[] = [];
    documentsSnapshot.forEach((doc) => {
      title.push(doc.id);
    });


    return title;
  }


}
