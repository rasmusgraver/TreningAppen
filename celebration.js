const W = window.innerWidth
const H = window.innerHeight
const celebration = document.getElementById("celebration")
const context = celebration.getContext("2d")
const maxConfettis = 150
const particles = []

let vinx = 0
let viny = 0
const vinElm = document.getElementById("vin")

function visVin() {
    vinElm.style.display = "block"
}
function flyttVin() {
    vinx += 1
    viny += 6
    vinElm.style.left = vinx + "px"
    vinElm.style.top = viny + "px"
    if (viny > document.body.offsetHeight) {
        viny = 0
    }
}

const possibleColors = [
    "DodgerBlue",
    "OliveDrab",
    "Gold",
    "Pink",
    "SlateBlue",
    "LightBlue",
    "Gold",
    "Violet",
    "PaleGreen",
    "SteelBlue",
    "SandyBrown",
    "Chocolate",
    "Crimson",
]

function randomFromTo(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from)
}

function confettiParticle(i) {
    this.x = Math.random() * W // x
    this.y = Math.random() * H - H // y
    this.r = randomFromTo(11, 33) // radius
    this.d = Math.random() * maxConfettis + 11
    if (i % 3 == 0) {
        this.color = "#8548c7"
    } else if (i % 3 == 1) {
        this.color = "#ef6e2d"
    } else {
        this.color =
            possibleColors[Math.floor(Math.random() * possibleColors.length)]
    }
    this.tilt = Math.floor(Math.random() * 33) - 11
    this.tiltAngleIncremental = Math.random() * 0.07 + 0.05
    this.tiltAngle = 0

    this.draw = function () {
        context.beginPath()
        context.lineWidth = this.r / 2
        context.strokeStyle = this.color
        context.moveTo(this.x + this.tilt + this.r / 3, this.y)
        context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5)
        return context.stroke()
    }
}

function celebrate() {
    // Initialize
    celebration.width = W
    celebration.height = H
    celebration.style.height = H + "px"
    celebration.style.zIndex = 1

    const results = []

    // Magical recursive functional love
    requestAnimationFrame(celebrate)

    context.clearRect(0, 0, W, window.innerHeight)

    for (var i = 0; i < maxConfettis; i++) {
        results.push(particles[i].draw())
    }

    let particle = {}
    let remainingFlakes = 0
    for (var i = 0; i < maxConfettis; i++) {
        particle = particles[i]

        particle.tiltAngle += particle.tiltAngleIncremental
        particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2
        particle.tilt = Math.sin(particle.tiltAngle - i / 3) * 15

        if (particle.y <= H) remainingFlakes++

        // If a confetti has fluttered out of view,
        // bring it back to above the viewport and let if re-fall.
        if (particle.x > W + 30 || particle.x < -30 || particle.y > H) {
            particle.x = Math.random() * W
            particle.y = -30
            particle.tilt = Math.floor(Math.random() * 10) - 20
        }
    }
    flyttVin()

    return results
}

// Push new confetti objects to `particles[]`
for (var i = 0; i < maxConfettis; i++) {
    particles.push(new confettiParticle(i))
}
