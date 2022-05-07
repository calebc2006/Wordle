import { getDict, getWords } from "./dictionary.js"
const minLength = localStorage.getItem("minLength")
const maxLength = localStorage.getItem("maxLength")
let dictionary = getDict(1, 30)
let curMode = "dict"
localStorage.setItem("mode", curMode)

const addBtn = document.getElementById("add-btn")
const userInput = document.getElementById("password")
const listGrid = document.getElementById("list-grid")
const minInput = document.getElementById("minInput")
const maxInput = document.getElementById("maxInput")

window.addEventListener("load", showList)

addBtn.addEventListener("click", () => {
    handleInput()
    userInput.value = ""
})
document.addEventListener("keypress", (e) => {
    if (e.code === "Enter") {
        handleInput()
        userInput.value = ""
    }
})

listGrid.addEventListener("click", (e) => {
    if (e.target.className === "list-item") {
        let word = e.target.innerHTML.split(" ")[1]

        let curItems = localStorage.getItem("wordlist")
        if (curItems == null) curItems = []
        else curItems = JSON.parse(curItems)
        curItems = curItems.filter((value) => {
            return value !== word
        })

        localStorage.setItem("wordlist", JSON.stringify(curItems))
        showList()
    }
})

function handleInput() {
    const input = userInput.value.toLowerCase()
    let curItems = localStorage.getItem("wordlist")
    if (curItems == null) curItems = []
    else curItems = JSON.parse(curItems)

    if (!curItems.includes(input)) {
        curItems.push(input)
        localStorage.setItem("wordlist", JSON.stringify(curItems))
        showList()
    } else {
        alert(`${input} is already in the list`)
    }
}

function showList() {
    let curItems = localStorage.getItem("wordlist")
    if (curItems == null) curItems = []
    else curItems = JSON.parse(curItems)
    listGrid.innerHTML = ""
    for (let i = 1; i <= curItems.length; i++) {
        addWord(curItems[i - 1], i)
    }

    minInput.value = minLength
    maxInput.value = maxLength
}

function addWord(word, index) {
    let newItem = document.createElement("div")
    newItem.className = "list-item"
    newItem.innerHTML = `${index}. ${word}`
    listGrid.appendChild(newItem)
}

const backArrow = document.getElementById("back-arrow")
backArrow.addEventListener("click", () => {
    location.href = "index.html"
})

const dictBtn = document.getElementById("dict")
const listBtn = document.getElementById("list")
const bothBtn = document.getElementById("both")

dictBtn.addEventListener("click", () => {
    handleClick(dictBtn)
})
listBtn.addEventListener("click", () => {
    handleClick(listBtn)
})
bothBtn.addEventListener("click", () => {
    handleClick(bothBtn)
})

function handleClick(elem) {
    dictBtn.className = "mode-btn"
    listBtn.className = "mode-btn"
    bothBtn.className = "mode-btn"

    elem.classList.add("selected")
    curMode = elem.id
    localStorage.setItem("mode", curMode)
}

setInterval(() => {
    if (minInput.value === "") {
        localStorage.setItem("minLength", minInput.value)
        document
            .querySelector(":root")
            .style.setProperty("--correctMinClr", "white")
    } else if (!isNaN(parseInt(minInput.value))) {
        localStorage.setItem("minLength", parseInt(minInput.value))
        document
            .querySelector(":root")
            .style.setProperty("--correctMinClr", "green")
    } else {
        document
            .querySelector(":root")
            .style.setProperty("--correctMinClr", "red")
    }

    if (maxInput.value === "") {
        localStorage.setItem("maxLength", maxInput.value)
        document
            .querySelector(":root")
            .style.setProperty("--correctMaxClr", "white")
    } else if (!isNaN(parseInt(maxInput.value))) {
        localStorage.setItem("maxLength", parseInt(maxInput.value))
        document
            .querySelector(":root")
            .style.setProperty("--correctMaxClr", "green")
    } else {
        document
            .querySelector(":root")
            .style.setProperty("--correctMaxClr", "red")
    }
}, 200)