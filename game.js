const BOARD_SIZE = 18
const boardElement = document.getElementById('board')
const diceElement = document.getElementById('dice')
const playerCategories = document.getElementById('player-categories')
const questionPanel = document.getElementById('question-panel')
const questionCategory = document.getElementById('question-category')
const questionText = document.getElementById('question-text')
const answersElement = document.getElementById('answers')
const feedbackElement = document.getElementById('feedback')

const API_URL = 'https://oma-trivia-api-0f8ffa1eed2e.herokuapp.com/api/questions'

const CATEGORIES = [
  { id: 'maantieto', name: 'Maantieto' },
  { id: 'yleistieto', name: 'Yleistieto' },
  { id: 'historia', name: 'Historia' },
  { id: 'taide ja kulttuuri', name: 'Taide ja kulttuuri' },
  { id: 'tiede', name: 'Tiede ja luonto' },
  { id: 'urheilu', name: 'Urheilu' }
]

const gameState = {
  player: {
    name: 'Pelaaja',
    position: 0
  }
}

const createBoard = () => {
  boardElement.innerHTML = ''
  const coordinates = createBoardCoordinates()
  for (let index = 0; index < BOARD_SIZE; index++) {
    const category = CATEGORIES[index % CATEGORIES.length]
    const coordinate = coordinates[index]
    const space = document.createElement('div')
    space.className = 'space'
    space.dataset.spaceIndex = index
    space.style.gridColumn = coordinate.column
    space.style.gridRow = coordinate.row
    space.dataset.category = category.id
    space.textContent = category.name
    boardElement.append(space)
  }
}

const createBoardCoordinates = () => {
  const coordinates = []
  for (let column = 1; column <= 7; column++)
    coordinates.push({ row: 1, column })
  for (let row = 2; row <= 4; row++)
    coordinates.push({ row, column: 7 })
  for (let column = 6; column >= 1; column--)
    coordinates.push({ row: 4, column })
  for (let row = 3; row >= 2; row--)
    coordinates.push({ row, column: 1 })
  return coordinates
}

const rollDice = () => {
  const result = Math.floor(Math.random() * 6) + 1
  diceElement.textContent = result
  movePlayer(result)
}

const updateTokens = () => {
  document.querySelectorAll('.token').forEach(token => token.remove())
  const currentSpace = document.querySelector(`[data-space-index="${gameState.player.position}"]`)
  const token = document.createElement('span')
  token.className = 'token'
  token.textContent = 'P'
  currentSpace.appendChild(token)
}

const movePlayer = async steps => {
  const player = gameState.player
  player.position = (player.position + steps) % BOARD_SIZE
  updateTokens()
  const category = getCategoryAtPosition(player.position)

  try {
    const question = await fetchQuestion(category.id)
    showQuestion(question, category)
  } catch (error) {
    console.log('Tapahtui virhe')
  }
}

const getCategoryAtPosition = position => CATEGORIES[position % CATEGORIES.length]

const updatePlayerCard = () => {
  playerCategories.innerHTML = ''
  CATEGORIES.forEach(category => {
    const chip = document.createElement('span')
    chip.className = 'category-chip'
    chip.dataset.category = category.id
    chip.textContent = category.name
    playerCategories.append(chip)
  })
}

const fetchQuestion = async category => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      category,
      difficulty: 'helppo',
      ageGroup: '10-12',
      count: 1,
      language: 'suomi'
    })
  })
  const data = await response.json()
  return data.questions[0]
}

const showQuestion = (question, category) => {
  questionPanel.hidden = false
  questionCategory.textContent = category.name
  questionText.textContent = question.question
}

dice.addEventListener("click", rollDice)

createBoard()
updateTokens()
updatePlayerCard()