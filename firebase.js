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
    serverTimestamp,
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

function getCurrentDatostr(offset = 0) {
    const dato = new Date()
    let mnd = dato.getMonth() + 1
    let dag = dato.getDate() - offset
    let aar = dato.getFullYear()

    if (dag <= 0) {
        mnd -= 1
        dag += 31
        if (mnd < 1) {
            mnd = 12
            aar -= 1
        }
        if ([4, 6, 9, 11].includes(mnd)) {
            dag -= 1
        } else if (mnd == 2) {
            if ((aar % 4 == 0 && aar % 100 != 0) || aar % 400 == 0) {
                dag -= 2
            } else {
                dag -= 3
            }
        }
    }
    return (
        aar +
        "_" +
        mnd.toString().padStart(2, "0") +
        "_" +
        dag.toString().padStart(2, "0")
    )
}

async function addToDB() {
    const dato = new Date()
    const mnd = dato.getMonth() + 1
    const dag = dato.getDate()
    const aar = dato.getFullYear()
    const datostr = getCurrentDatostr()
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
            timestamp: serverTimestamp(),
        })
    } else {
        console.log("Allerede lagret i Firebase")
        statusDiv.textContent = "Allerede lagret i DB"
        statusDiv.className = "blue"
        // Trengs ikke lenger?  clearStatusTimer()
    }

    const streak = await verifiserInsert()
    if (streak > 0) {
        localStorage.setItem("datostr", datostr)
        statusDiv.innerHTML =
            "Streak på " +
            streak +
            " dager" +
            "<br> => " +
            getStreakMessage(streak)
        statusDiv.className = "green"
        // TODO TAKE BACK! (ELLER ikke!?) clearStatusTimer()
    } else {
        console.log("Klarte ikke å lagre i Firebase. Streak: " + streak)
        alert("Fikk ikke lagret treningen din i Databasen!")
        statusDiv.textContent = "Klarte ikke å lagre i DB"
        statusDiv.className = "red"
    }
}

window.addToDB = addToDB

function clearStatusTimer() {
    setTimeout(() => {
        statusDiv.textContent = ""
        statusDiv.className = ""
    }, 2000)
}

function getStreakMessage(streak) {
    let tilbakemeldinger = [
        "Jobba på!",
        "Sterkt!",
        "Imponerende!",
        "Du er god!!",
        "Du eier dette!",
        "Knallbra jobba!",
        "For en fremgang!",
        "Du viser ekte styrke!",
        "Keep it up, dette er veien til suksess!",
        "Hver økt teller, og du nailer det!",
        "Du inspirerer!",
        "Power! Du er på topp!",
        "Så stolt av deg!",
        "Flink du er, dette er gull!",
        "Du blir bare bedre og bedre!",
    ]
    if (streak > 10) {
        tilbakemeldinger.push("Helt rå!")
        tilbakemeldinger.push("Du er så dedikert!")
        tilbakemeldinger.push("Julekroppen er snart i boks!")
        tilbakemeldinger.push("Fantastisk innsats!")
    }
    if (streak > 20) {
        tilbakemeldinger.push("WOW, for en prestasjon!")
        tilbakemeldinger.push("Dette er hardt arbeid i praksis!")
    }

    return tilbakemeldinger[Math.floor(Math.random() * tilbakemeldinger.length)]
}

async function verifiserInsert() {
    const querySnapshot = await getDocs(
        query(
            treningCollection,
            // where("datostr", "==", datostr),
            where("navn", "==", brukernavn),
            where("gruppe", "==", gruppenavn)
            // Funker ikke ... orderBy("datostr", "desc")
            // limit(1)
        )
    )
    if (querySnapshot.docs.length == 0) {
        return 0
    } else {
        return getStreak(getDatostringsSorted(querySnapshot.docs))
    }
}

function getStreak(datostrings) {
    let streak = 0
    let datostr = getCurrentDatostr()
    let previousDatostr = ""

    for (let datostring of datostrings) {
        console.log("Sjekker: " + datostring)
        if (datostring == previousDatostr) {
            // I tilfelle en dato er lagret dobbelt
            console.log("Samme som forrige: " + datostring)
        } else {
            if (datostring == datostr) {
                streak += 1
                console.log("Økte streak med 1: " + datostring)
            } else {
                console.log(
                    "Slutt på streak: " + datostring,
                    " (skulle vært " + datostr + ")"
                )
                return streak
            }
            previousDatostr = datostr // Lagrer for å sjekke for duplikater
            datostr = getCurrentDatostr(streak) // The streak works as the offset here...
        }
    }
    return streak
}

function getDatostringsSorted(docs) {
    const datostrings = []
    docs.forEach((doc) => {
        const data = doc.data()
        if (data.datostr && data.datostr != "2024_11_9") {
            // Feil i dataene som ble lagret først...
            datostrings.push(data.datostr)
        }
    })
    datostrings.sort()
    datostrings.reverse() // Sorterer fra nyeste til eldste
    console.log("Sorterte datostr: ", datostrings)
    return datostrings
}

async function hentTreninger() {
    console.log("Henter treninger...")
    const querySnapshot = await getDocs(
        //    query(treningCollection, orderBy("datostr", "desc"), limit(100))
        treningCollection
    )
    let antMedTestGruppe = 0
    let antMedTomDato = 0
    let gruppeListe = {}
    querySnapshot.forEach((doc) => {
        const data = doc.data()
        const gruppenavn = data.gruppe.trim()
        const testGruppeNavn = ["test", "nykode", "ita"]
        if (testGruppeNavn.includes(gruppenavn)) {
            // logData(data, "Ignorerer trening pga gruppenavn: ")
            antMedTestGruppe++
        } else if (!data.datostr || data.datostr == "2024_11_11") {
            // logData(data, "Ignorerer trening pga dato:")
            antMedTomDato++
        } else {
            if (
                // data.navn == "Ida Sofie" ||
                // data.navn == "Gro Helene" ||
                data.navn.startsWith("Lena") &&
                data.mnd == "11" &&
                data.dag == "22"
            ) {
                logData(data, "Debug:")
            }

            let gruppe = null
            if (gruppeListe[gruppenavn]) {
                gruppe = gruppeListe[gruppenavn]
            } else {
                gruppe = {
                    gruppe: gruppenavn,
                    brukere: {},
                    treninger: 0,
                    brukerAntall: 0,
                }
                gruppeListe[gruppenavn] = gruppe
            }
            const brukernavn = data.navn.trim()
            let bruker = null
            if (gruppe.brukere[brukernavn]) {
                bruker = gruppe.brukere[brukernavn]
            } else {
                bruker = {
                    brukernavn: brukernavn,
                    treninger: 0,
                    datoer: [],
                }
                gruppe.brukere[brukernavn] = bruker
                gruppe.brukerAntall++
            }
            bruker.treninger++
            gruppe.treninger++
            bruker.datoer.push(data.datostr)
        }
    })

    fixTreningsData(gruppeListe)

    // console.log(gruppeListe)
    // console.log(JSON.stringify(gruppeListe, null, 2))

    console.log(
        "Ignorerte treninger testGruppe (Det var 56): ",
        antMedTestGruppe
    )
    console.log("Ignorerte treninger tomDato (Det var 14): ", antMedTomDato)

    skrivTreningerTilDom(gruppeListe)
}

window.hentTreninger = hentTreninger

function logData(data, mld) {
    console.log(
        mld,
        data.gruppe,
        data.navn,
        data.datostr,
        data.dag,
        data.mnd,
        data.aar,
        data.timestamp ? data.timestamp.toDate().toLocaleString() : "Ukjent"
    )
}

function fixTreningsData(gruppeListe) {
    Object.values(gruppeListe).forEach((gruppe) => {
        gruppe.treninger = 0
        gruppe.brukerAntall = 0
        Object.values(gruppe.brukere).forEach((bruker) => {
            // Remove duplicates:
            const oldLen = bruker.datoer.length
            bruker.datoer = [...new Set(bruker.datoer)]
            const newLen = bruker.datoer.length
            if (oldLen > newLen + 2) {
                console.log(
                    "Fjernet duplicater: ",
                    oldLen - newLen,
                    " av i alt ",
                    oldLen,
                    " for bruker: ",
                    bruker.brukernavn
                )
            }
            bruker.datoer.sort()
            bruker.treninger = bruker.datoer.length
            gruppe.treninger += bruker.treninger
            gruppe.brukerAntall++
        })
    })
}

function skrivTreningerTilDom(gruppeListe) {
    const resultsDiv = document.getElementById("results")
    resultsDiv.innerHTML = ""
    Object.values(gruppeListe).forEach((gruppe) => {
        const gruppeDiv = document.createElement("div")
        gruppeDiv.textContent = gruppe.gruppe
        gruppeDiv.className = "gruppe"
        resultsDiv.appendChild(gruppeDiv)

        const gruppeResults = document.createElement("div")
        gruppeResults.className = "grupperesults"
        gruppeResults.textContent =
            gruppe.treninger +
            " treninger" +
            ", delt på: " +
            gruppe.brukerAntall +
            " gir et snitt på " +
            Math.round((gruppe.treninger * 10) / gruppe.brukerAntall) / 10
        gruppeDiv.appendChild(gruppeResults)

        Object.values(gruppe.brukere).forEach((bruker) => {
            const brukerDiv = document.createElement("div")
            brukerDiv.className = "bruker"
            brukerDiv.textContent = `${bruker.brukernavn} - ${bruker.treninger} treninger`
            gruppeDiv.appendChild(brukerDiv)
            const datoDiv = document.createElement("div")
            bruker.datoer.forEach((datostr) => {
                datoDiv.innerHTML += datostr + "<br>"
            })
            datoDiv.className = "datoer"
            brukerDiv.appendChild(datoDiv)
        })
    })
}
