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
const statusDiv = document.getElementById("status")

async function addToDB() {
    const dato = new Date()
    const mnd = dato.getMonth() + 1
    const dag = dato.getDate()
    const aar = dato.getFullYear()
    const datostr = aar + "_" + mnd + "_" + dag
    if (datostr != localStorage.getItem("datostr")) {
        statusDiv.textContent = "Lagrer til DB"
        statusDiv.className = "blue"
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
        verifiserInsert(datostr)
    } else {
        console.log("Allerede lagret i Firebase")
        statusDiv.textContent = "Allerede lagret i DB"
        statusDiv.className = "blue"
        clearStatusTimer()
    }
}

window.addToDB = addToDB

function clearStatusTimer() {
    setTimeout(() => {
        statusDiv.textContent = ""
        statusDiv.className = ""
    }, 2000)
}

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
        statusDiv.textContent = "Klarte ikke å lagre i DB"
        statusDiv.className = "red"
    } else {
        statusDiv.textContent = "Lagret i DB"
        statusDiv.className = "green"
        clearStatusTimer()
    }
}

async function hentTreninger() {
    console.log("Henter treninger...")
    const querySnapshot = await getDocs(
        query(treningCollection, orderBy("datostr", "desc"), limit(100))
    )
    let gruppeListe = {}
    querySnapshot.forEach((doc) => {
        const data = doc.data()
        const gruppenavn = data.gruppe
        console.log(
            data.gruppe,
            data.navn,
            data.datostr,
            data.dag,
            data.mnd,
            data.aar
        )

        let gruppe = null
        if (gruppeListe[gruppenavn]) {
            gruppe = gruppeListe[gruppenavn]
        } else {
            gruppe = {
                gruppe: gruppenavn,
                brukere: {},
            }
            gruppeListe[gruppenavn] = gruppe
        }
        const brukernavn = data.navn
        let bruker = null
        if (gruppe.brukere[brukernavn]) {
            bruker = gruppe.brukere[brukernavn]
            bruker.treninger++
        } else {
            bruker = {
                brukernavn: brukernavn,
                treninger: 1,
            }
            gruppe.brukere[brukernavn] = bruker
        }
    })

    // console.log(gruppeListe)
    console.log(JSON.stringify(gruppeListe, null, 2))
}

window.hentTreninger = hentTreninger
