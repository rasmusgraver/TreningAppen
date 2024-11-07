let brukernavn = localStorage.getItem("brukernavn")
let gruppenavn = localStorage.getItem("gruppenavn")

console.log("brukernavn", brukernavn, "gruppenavn", gruppenavn)

mainRegistrer = document.getElementById("registrer")
mainTren = document.getElementById("tren")

visTrening()

function registrer() {
    gruppenavn = document.getElementById("gruppeinput").value.toLowerCase()
    brukernavn = document.getElementById("brukerinput").value

    console.log("brukernavn", brukernavn, "gruppenavn", gruppenavn)

    localStorage.setItem("brukernavn", brukernavn)
    localStorage.setItem("gruppenavn", gruppenavn)

    visTrening()
}

function visRegistrer() {
    document.getElementById("brukerinput").value = brukernavn
    document.getElementById("gruppeinput").value = gruppenavn
    mainRegistrer.style.display = "flex"
    mainTren.style.display = "none"
}

function visTrening() {
    if (!(brukernavn && gruppenavn)) {
        visRegistrer()
    } else {
        document.getElementById("brukertekst").innerHTML = brukernavn
        document.getElementById("gruppetekst").innerHTML = gruppenavn
        mainRegistrer.style.display = "none"
        mainTren.style.display = "flex"
    }
}

function hartrent() {
    // alert("Gratulerer!")
    celebrate()
    const trentSpan = document.getElementById("trent_tekst")
    trentSpan.innerHTML = "Bra jobba!"
    trentSpan.parentElement.style.backgroundColor = "#30ec3b"
    addToDB()
}
