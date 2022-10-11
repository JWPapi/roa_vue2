import firebase from "firebase/app";
import "firebase/firestore";

// Get a Firestore instance
export const db = firebase.initializeApp(window.roa.firebase).firestore();
const AUTH_DOMAIN = window.roa.firebase.authDomain;
const PROFILES_REFERENCE = db.collection("profiles");
const { Timestamp } = firebase.firestore;
export { Timestamp, PROFILES_REFERENCE, AUTH_DOMAIN };
