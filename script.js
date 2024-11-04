
let brukernavn = localStorage.getItem("brukernavn");
let gruppenavn = localStorage.getItem("gruppenavn");

console.log("brukernavn", brukernavn, "gruppenavn", gruppenavn)

mainRegistrer = document.getElementById("registrer")
mainTren = document.getElementById("tren")


if (!(brukernavn && gruppenavn)) {
    mainRegistrer.style.display = "flex"
    mainTren.style.display = "none"
} else {
    mainRegistrer.style.display = "none"
    mainTren.style.display = "flex"
}

function registrer() {
    gruppenavn = document.getElementById("gruppeinput").value.toLowerCase()
    brukernavn = document.getElementById("brukerinput").value

    console.log("brukernavn", brukernavn, "gruppenavn", gruppenavn)
}