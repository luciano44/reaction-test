let turnYellowTime // time in miliseconds when screen turned yellow
let reactionTime // time in miliseconds when user clicked on yellow screen
let timeout // timeout reference which is used to cancel timeout if user clicks before yellow screen shows up
let averageReactionTime
const reactionHistoryArray = []

const reactionBestParagraph = document.querySelector(".reaction-best p")
const reactionAverageParagraph = document.querySelector(".reaction-average p")
const mainParagraph = document.querySelector(".main-paragraph")
const container = document.querySelector(".container-content")

container.addEventListener("click", turnBlue)

// "ready" state, wait for yellow
function turnBlue() {
  removeContainerClasses()
  container.removeEventListener("click", turnBlue)

  container.addEventListener("click", turnRed)
  container.classList.add("blue")
  mainParagraph.textContent = "Wait for Yellow"

  // generate a random number to be passed to timeout so user doesn't know when to expect yellow screen
  const randomNumber = Math.floor(Math.random() * 3_000) + 1000

  timeout = setTimeout(turnYellow, randomNumber)
}

// "go!" state, click as fast as possible
function turnYellow() {
  removeContainerClasses()
  container.removeEventListener("click", turnRed)
  container.classList.add("yellow")
  mainParagraph.textContent = "Click"

  turnYellowTime = Date.now()
  container.addEventListener("click", getReactionTime)
}

// "too quickly!" state, start again
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

  appendReactionTimeToHistory(result)
  reactionHistoryArray.push(result)

  const averageResult =
    reactionHistoryArray.reduce((a, b) => a + b) / reactionHistoryArray.length

  reactionAverageParagraph.textContent = averageResult.toFixed()

  // Append best reaction time
  if (reactionBestParagraph.textContent.includes("?"))
    reactionBestParagraph.textContent = result

  if (parseInt(reactionBestParagraph.textContent) > result) {
    reactionBestParagraph.textContent = result
  }

  mainParagraph.textContent = `Your reaction time was: ${result}ms, click to play again`
  container.addEventListener("click", turnBlue)
}

function appendReactionTimeToHistory(timeInMs) {
  const li = document.createElement("li")
  const p = document.createElement("p")
  const span = document.createElement("span")
  const reactionHistoryList = document.querySelector(".reaction-history ul")

  p.textContent = timeInMs
  span.textContent = "ms"
  li.append(p)
  li.append(span)

  reactionHistoryList.insertAdjacentElement("afterbegin", li)
}

document.querySelector("header").addEventListener("click", () => {
  appendReactionTimeToHistory(300)
})
