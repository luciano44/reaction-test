let turnYellowTime // time in miliseconds when screen turned yellow
let reactionTime // time in miliseconds when user clicked on yellow screen
let timeout // timeout reference which is used to cancel timeout if user clicks before yellow screen shows up
let averageReactionTime
let reactionHistoryArray = []

const reactionBestParagraph = document.querySelector(".reaction-best p")
const reactionAverageParagraph = document.querySelector(".reaction-average p")
const reactionWorstParagraph = document.querySelector(".reaction-worst p")
const mainParagraph = document.querySelector(".main-paragraph")
const container = document.querySelector(".container-content")
const clickAnimatedButton = document.querySelector(".main-paragraph.click")
const resetBtn = document.querySelector(".reset-btn")
const reactionHistoryList = document.querySelector(".reaction-history ul")

container.addEventListener("click", turnBlue)
resetBtn.addEventListener("click", () => {
  const confirmDeletion = confirm("Are you sure you wish to delete the score?")
  reset(confirmDeletion)
})

// "ready" state, wait for yellow
function turnBlue() {
  removeContainerClasses()
  container.removeEventListener("click", turnBlue)

  container.addEventListener("click", turnRed)
  container.classList.add("blue")
  mainParagraph.textContent = "Wait for Yellow"

  // generate a random number to be passed to timeout so user doesn't know when to expect yellow screen
  const randomNumber = Math.floor(Math.random() * 4_000) + 1500

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

  clickAnimatedButton.removeAttribute("hidden")
  mainParagraph.setAttribute("hidden", "")
}

// "too quickly!" state, start again
function turnRed() {
  removeContainerClasses()
  container.removeEventListener("click", turnRed)
  clearTimeout(timeout)
  container.classList.add("red")
  mainParagraph.textContent = "Too Soon, Click to Restart"

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

  // Append best and worst reaction time (for the very first time)
  if (reactionBestParagraph.textContent.includes("?")) {
    reactionBestParagraph.textContent = result
    reactionWorstParagraph.textContent = result
  }

  // Append best reaction time if new result is lesser than current best one
  if (parseInt(reactionBestParagraph.textContent) > result) {
    reactionBestParagraph.textContent = result
  }

  // Append worst reaction time if new result is greater than current worst one
  if (parseInt(reactionWorstParagraph.textContent) < result) {
    reactionWorstParagraph.textContent = result
  }

  showReactionTimeText(result)

  container.addEventListener("click", turnBlue)

  clickAnimatedButton.setAttribute("hidden", "")
  mainParagraph.removeAttribute("hidden")
}

function appendReactionTimeToHistory(timeInMs) {
  const li = document.createElement("li")
  const p = document.createElement("p")
  const span = document.createElement("span")

  p.textContent = timeInMs
  span.textContent = "ms"
  span.classList.add("ms")
  li.append(p)
  li.append(span)

  reactionHistoryList.insertAdjacentElement("afterbegin", li)
}

function showReactionTimeText(result) {
  mainParagraph.textContent = `Your reaction time was: `
  const span = document.createElement("span")
  span.classList.add("highlight")
  span.textContent = `${result}ms`
  mainParagraph.append(span)
  mainParagraph.append(" Click to Restart")
}

function reset(confirm) {
  const reactionTimeListItems = document.querySelectorAll(
    ".reaction-history ul li"
  )

  if (!confirm) return
  reactionWorstParagraph.textContent = "?"
  reactionBestParagraph.textContent = "?"
  reactionAverageParagraph.textContent = "?"
  reactionHistoryArray = []

  reactionTimeListItems.forEach((item) => item.remove())
}

// Adds Header click event to generate example reaction history time
// document.querySelector("header").addEventListener("click", () => {
//   appendReactionTimeToHistory(300)
// })
