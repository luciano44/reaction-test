let turnYellowTime // time in miliseconds when screen turned yellow
let reactionTime // time in miliseconds when user clicked on yellow screen
let timeout // timeout reference which is used to cancel timeout if user clicks before yellow screen shows up

const reactionBestParagraph = document.querySelector(".reaction-best p")
const mainParagraph = document.querySelector(".main-paragraph")
const container = document.querySelector(".container-content")

container.addEventListener("click", turnBlue)

function turnBlue() {
  removeContainerClasses()
  container.removeEventListener("click", turnBlue)

  container.addEventListener("click", turnRed)
  container.classList.add("blue")
  mainParagraph.textContent = "Wait for Yellow"

  // generate a random number to be passed to timeout so user doesn't know when to expect yellow screen
  const randomNumber = Math.floor(Math.random() * 6_000) + 2000

  timeout = setTimeout(turnYellow, randomNumber)
}

function turnYellow() {
  removeContainerClasses()
  container.removeEventListener("click", turnRed)
  container.classList.add("yellow")
  mainParagraph.textContent = "Click"

  turnYellowTime = Date.now()
  container.addEventListener("click", getReactionTime)
}

function turnRed() {
  removeContainerClasses()
  container.removeEventListener("click", turnRed)
  clearTimeout(timeout)
  container.classList.add("red")
  mainParagraph.textContent = "Too Soon, Click again to restart"

  container.addEventListener("click", turnBlue)
}

function removeContainerClasses() {
  container.classList.remove("red")
  container.classList.remove("blue")
  container.classList.remove("yellow")
}

function getReactionTime() {
  container.removeEventListener("click", getReactionTime)

  removeContainerClasses()
  reactionTime = Date.now()

  const result = reactionTime - turnYellowTime

  if (reactionBestParagraph.textContent == "?")
    reactionBestParagraph.textContent = result
  if (parseInt(reactionBestParagraph.textContent) > result) {
    reactionBestParagraph.textContent = result
  }

  mainParagraph.textContent = `Your reaction time was: ${result}ms, click to play again`
  container.addEventListener("click", turnBlue)
}
