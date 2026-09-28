const BOARD_SIZE = 18
const boardElement = document.getElementById('board')

const CATEGORIES = [
  { id: 'maantieto', name: 'Maantieto' },
  { id: 'yleistieto', name: 'Yleistieto' },
  { id: 'historia', name: 'Historia' },
  { id: 'taide ja kulttuuri', name: 'Taide ja kulttuuri' },
  { id: 'tiede', name: 'Tiede ja luonto' },
  { id: 'urheilu', name: 'Urheilu' }
]

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

createBoard()