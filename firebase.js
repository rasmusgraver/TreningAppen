// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js"
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js"

import {
    getFirestore,
    collection,
    getDocs,
    getDoc,
    where,
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

async function addToDB() {
    const dato = new Date()
    const mnd = dato.getMonth() + 1
    const dag = dato.getDate()
    const aar = dato.getFullYear()
    const datostr = aar + "_" + mnd + "_" + dag
    if (datostr != localStorage.getItem("datostr")) {
        await setDoc(doc(treningCollection), {
            gruppe: gruppenavn,
            navn: brukernavn,
            datostr: datostr,
            dag: dag,
            mnd: mnd,
            aar: aar,
        })
        console.log("Lagret til Firebase")
        localStorage.setItem("datostr", datostr)
        verifiserInsert(datostr) // TODO: Det her funka ikke helt
        // TODO: I stedet: Hvis mld "Lagrer i DB" og så fjern den når suksess
    } else {
        console.log("Allerede lagret i Firebase")
    }
}

window.addToDB = addToDB

async function verifiserInsert(datostr) {
    const querySnapshot = await getDocs(
        query(
            treningCollection,
            where("datostr", "==", datostr),
            where("navn", "==", brukernavn),
            where("gruppe", "==", gruppenavn),
            limit(1)
        )
    )
    if (querySnapshot.docs.length == 0) {
        alert("Fikk ikke lagret treningen din i Databasen!")
    }
}
