import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const donorsRef = collection(db, "donors");

export async function getAllDonors() {
  const snap = await getDocs(donorsRef);
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function donorExistsByPhone(phone) {
  const q = query(donorsRef, where("phone", "==", phone));
  const snap = await getDocs(q);
  return !snap.empty;
}

export async function addDonor({ name, bloodGroup, phone }) {
  await addDoc(donorsRef, {
    name,
    bloodGroup,
    phone,
    createdAt: serverTimestamp(),
  });
}
