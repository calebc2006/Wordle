const loginBtn = document.getElementById("login-btn")
const userInput = document.getElementById("password")
const PASSWORD = "password"

loginBtn.addEventListener("click", () => {
  handleInput()
  userInput.value = ""
})
document.addEventListener("keypress", (e) => {
  if (e.code === "Enter") {
    handleInput()
    userInput.value = ""
  }
})

function handleInput() {
  const input = userInput.value
  if (input === PASSWORD) {
    userInput.placeholder = "Admin Password"
    document
      .querySelector(":root")
      .style.setProperty("--placeholder-color", "hsl(240, 3%, 7%)")

    location.href = "admin-page.html"
  } else {
    userInput.placeholder = "INCORRECT PASSWORD"
    document
      .querySelector(":root")
      .style.setProperty("--placeholder-color", "red")
  }
}
