// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js"
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js"

import {
    getFirestore,
    collection,
    getDocs,
    getDoc,
    doc,
    setDoc,
    deleteDoc,
    updateDoc,
    query,
    orderBy,
    limit,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC2TtJkgrIyQBIo3qt8JjXKGuu3ZuxPOfM",
    authDomain: "treningsblogg-44632.firebaseapp.com",
    projectId: "treningsblogg-44632",
    storageBucket: "treningsblogg-44632.firebasestorage.app",
    messagingSenderId: "859053968856",
    appId: "1:859053968856:web:9b3b2722c9a826c8ec76ad",
    measurementId: "G-TM4HK8ZBTF",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// const analytics = getAnalytics(app)

const db = getFirestore(app)
const dbName = "trening"
const treningCollection = collection(db, dbName)

async function addToDB(/* event? */) {
    // event.preventDefault()
    // let textRef = document.getElementById("todo-input")
    await setDoc(doc(treningCollection), {
        gruppe: brukernavn,
        navn: brukernavn,
        dato: "en_dag_her", // Date.now(),
    })
    console.log("Lagret til Firebase")
    // refreshItemList()
    //   .catch((error) => console.warn(error))
    // textRef.value = ""
}

window.addToDB = addToDB
