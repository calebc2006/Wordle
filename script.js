import { getWords, getDict } from "./dictionary.js"

let wordList = JSON.parse(localStorage.getItem("wordlist"))
if (wordList == undefined || wordList == null) wordList = []

const curMode = localStorage.getItem("mode")
if (curMode == undefined || curMode == null) curMode = "dict"

const minLength = localStorage.getItem("minLength")
if (minLength == undefined || minLength == null) minLength = 5

const maxLength = localStorage.getItem("maxLength")
if (maxLength == undefined || maxLength == null) maxLength = 5

const dictionary = [...getDict(minLength, maxLength), ...wordList]
let targetWords

if (curMode === "dict") {
    targetWords = getWords(minLength, maxLength)
} else if (curMode === "list") {
    targetWords = wordList
} else {
    targetWords = [...wordList, ...getWords(minLength, maxLength)]
}

const targetWord = targetWords[Math.floor(Math.random() * targetWords.length)]
const WORD_LENGTH = targetWord.length

const FLIP_ANIMATION_DURATION = 500
const DANCE_ANIMATION_DURATION = 500
const guessGrid = document.querySelector("[data-guess-grid]")
const keyboard = document.querySelector("[data-keyboard]")
const alertContainer = document.querySelector("[data-alert-container]")

window.addEventListener("load", () => {
    addHTMLElements()
    startInteraction()
    console.log(targetWord)
})

function startInteraction() {
    document.addEventListener("click", handleMouseClick)
    document.addEventListener("keydown", handleKeyPress)
}

function stopInteraction() {
    document.removeEventListener("click", handleMouseClick)
    document.removeEventListener("keydown", handleKeyPress)
}

function handleMouseClick(e) {
    if (e.target.matches("[data-key]")) {
        pressKey(e.target.dataset.key)
        return
    }
    if (e.target.matches("[data-enter]")) {
        submitGuess()
        return
    }
    if (e.target.matches("[data-delete]")) {
        deleteKey()
        return
    }
}

function handleKeyPress(e) {
    if (e.key === "Enter") {
        submitGuess()
        return
    }
    if (e.key === "Backspace" || e.key === "Delete") {
        deleteKey()
        return
    }
    if (e.key.match(/^[a-z]$/)) {
        pressKey(e.key)
        return
    }
}

function pressKey(key) {
    const activeTiles = getActiveTiles()
    if (activeTiles.length >= WORD_LENGTH) return

    const nextTile = guessGrid.querySelector(":not([data-letter])")
    nextTile.dataset.letter = key.toLowerCase()
    nextTile.textContent = key
    nextTile.dataset.state = "active"
}

function deleteKey() {
    const activeTiles = getActiveTiles()
    const lastTile = activeTiles[activeTiles.length - 1]
    if (lastTile == null) return
    lastTile.textContent = ""
    delete lastTile.dataset.state
    delete lastTile.dataset.letter
}

function submitGuess() {
    const activeTiles = [...getActiveTiles()]
    if (activeTiles.length !== WORD_LENGTH) {
        showAlert("Not enough letters")
        shakeTiles(activeTiles)
        return
    }

    let guess = activeTiles.reduce((word, tile) => {
        return word + tile.dataset.letter
    }, "")
    if (!dictionary.includes(guess)) {
        showAlert("Not in word list")
        shakeTiles(activeTiles)
        return
    }

    stopInteraction()
    activeTiles.forEach((...params) => {
        flipTile(...params, guess)
    })
}

function flipTile(tile, index, array, guess) {
    const letter = tile.dataset.letter
    const key = keyboard.querySelector(`[data-key="${letter.toUpperCase()}"]`)
    setTimeout(() => {
        tile.classList.add("flip")
    }, (index * FLIP_ANIMATION_DURATION) / 2)

    tile.addEventListener(
        "transitionend",
        () => {
            tile.classList.remove("flip")
            if (targetWord[index] === letter) {
                tile.dataset.state = "correct"
                key.classList.add("correct")
            } else if (targetWord.includes(letter)) {
                tile.dataset.state = "wrong-location"
                key.classList.add("wrong-location")
            } else {
                tile.dataset.state = "wrong"
                key.classList.add("wrong")
            }

            if (index === array.length - 1) {
                tile.addEventListener(
                    "transitionend",
                    () => {
                        startInteraction()
                        checkWinLose(guess, array)
                    },
                    { once: true }
                )
            }
        },
        { once: true }
    )
}

function getActiveTiles() {
    return guessGrid.querySelectorAll('[data-state="active"]')
}

function showAlert(message, duration = 1000) {
    const alert = document.createElement("div")
    alert.textContent = message
    alert.classList.add("alert")
    alertContainer.prepend(alert)
    if (duration == null) return

    setTimeout(() => {
        alert.classList.add("hide")
        alert.addEventListener("transitionend", () => {
            alert.remove()
        })
    }, duration)
}

function shakeTiles(tiles) {
    tiles.forEach((tile) => {
        tile.classList.add("shake")
        tile.addEventListener(
            "animationend",
            () => {
                tile.classList.remove("shake")
            },
            { once: true }
        )
    })
}

function danceTiles(tiles) {
    tiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add("dance")
            tile.addEventListener(
                "animationend",
                () => {
                    tile.classList.remove("dance")
                },
                { once: true }
            )
        }, (index * DANCE_ANIMATION_DURATION) / 5)
    })
}

function checkWinLose(guess, tiles) {
    if (guess === targetWord) {
        showAlert("You Win", 5000)
        danceTiles(tiles)
        stopInteraction()
        return
    }

    const remainingTiles = guessGrid.querySelectorAll(":not([data-letter])")
    if (remainingTiles.length === 0) {
        showAlert(targetWord.toUpperCase(), null)
    }
}

function addHTMLElements() {
    guessGrid.innerHTML = ""

    for (let i = 0; i < WORD_LENGTH * 6; i++) {
        let tile = document.createElement("div")
        tile.classList.add("tile")
        guessGrid.appendChild(tile)
    }

    let root = document.querySelector(":root")
    root.style.setProperty("--word-length", WORD_LENGTH)
}

const backArrow = document.getElementById("back-arrow")
backArrow.addEventListener("click", () => {
    location.href = "index.html"
})
