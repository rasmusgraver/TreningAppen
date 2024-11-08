const mndList = [
    "Januar",
    "Februar",
    "Mars",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Desember",
]
const current_month_header = document.getElementById("current_month_header")
const current_month_table = document.getElementById("current_month_table")
const dato = new Date()
const mndNavn = mndList[dato.getMonth()]
current_month_header.innerHTML = mndNavn

let th_str = "<thead><tr><th>NykodeMed</th>"
for (let i = 1; i <= 31; i++) {
    th_str += `<th>${i}</th>`
}
th_str += "</tr></thead>"
current_month_table.innerHTML += th_str

// TODO: Gå igjennom alle forekomster fra DB. Lag en dict med dem? Loop igjennom
// med samme for-løkke og sett x der det er en forekomst.

tbody_str = "<tbody>"
tbody_str += "<tr><td>Person 1</td>"
for (let i = 1; i <= 31; i++) {
    tbody_str += `<th> - </th>`
}
tbody_str += "</tr>"
tbody_str += "</tbody>"
current_month_table.innerHTML += tbody_str
