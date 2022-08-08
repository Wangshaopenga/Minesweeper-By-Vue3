import { BlockState } from '@/types'
import { Ref } from 'vue'
const directions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
]
interface GameState {
  board: BlockState[][]
  mineGenerated: boolean
  gameState: 'play' | 'won' | 'lost'
  gametime: any
}
export class GamePlay {
  state = ref() as Ref<GameState>
  constructor(
    public width: number,
    public height: number,
    public mines: number,
  ) {
    this.reset()
  }
  get board() {
    return this.state.value.board
  }
  get blocks() {
    return this.state.value.board.flat() as BlockState[]
  }
  reset(width = this.width, height = this.height, mines = this.mines) {
    this.width = width
    this.height = height
    this.mines = mines
    this.state.value = {
      mineGenerated: false,
      gameState: 'play',
      board: Array.from({ length: this.height }, (_, y) =>
        Array.from(
          { length: this.width },
          (_, x): BlockState => ({
            x,
            y,
            adjacentMines: 0,
          }),
        ),
      ),
      gametime: useInterval(1000, { controls: true }),
    }
  }
  updateNumber() {
    this.board.forEach((row, y) => {
      row.forEach((block, x) => {
        if (block.mine) return
        this.getSiblings(block).forEach((item) => {
          if (item.mine) block.adjacentMines++
        })
      })
    })
  }
  getSiblings(block: BlockState) {
    return directions
      .map(([dx, dy]) => {
        const xx = block.x + dx
        const yy = block.y + dy
        if (xx < 0 || xx >= this.width || yy < 0 || yy >= this.height)
          return undefined
        return this.board[yy][xx]
      })
      .filter(Boolean) as BlockState[]
  }
  randomInt(min: number, max: number) {
    return Math.round(Math.random() * (max - min) + min)
  }
  generateMines(state: BlockState[][], initial: BlockState) {
    const randomPlace = () => {
      const x = this.randomInt(0, this.width - 1)
      const y = this.randomInt(0, this.height - 1)
      const block = state[y][x]
      if (
        Math.abs(initial.x - block.x) <= 1 &&
        Math.abs(initial.y - block.y) <= 1
      )
        return false
      if (block.mine) return false
      block.mine = true
      return true
    }
    Array.from({ length: this.mines }, () => null).forEach(() => {
      let placed = false
      while (!placed) {
        placed = randomPlace()
      }
    })
    this.updateNumber()
  }
  expendZero(block: BlockState) {
    if (block.adjacentMines) return
    this.getSiblings(block).forEach((item) => {
      if (!item.revealed) {
        item.flagged = false
        item.revealed = true
        this.expendZero(item)
      }
    })
  }
  autoExpand(block: BlockState) {
    const siblings = this.getSiblings(block)
    const flags = siblings.reduce(
      (a, b) => a + (b.flagged && b.mine ? 1 : 0),
      0,
    )
    if (flags === block.adjacentMines) {
      siblings.forEach((i) => {
        if (!i.mine) i.revealed = true
      })
    }
  }
  onLeftClick(block: BlockState) {
    if (block.flagged) return
    if (!this.state.value.mineGenerated) {
      this.state.value.mineGenerated = true
      this.generateMines(this.board, block)
    }
    this.expendZero(block)
    block.revealed = true
    if (block.mine) {
      this.state.value.gameState = 'lost'
      this.showAllMines()
      this.state.value.gametime.pause()
      alert('BOOOM!')
      return
    }
  }
  showAllMines() {
    this.board.flat().forEach((i) => {
      if (i.mine) i.revealed = true
    })
  }
  onRightClick(block: BlockState) {
    if (block.revealed && !block.flagged) return
    block.flagged = !block.flagged
  }
  checkGameState() {
    if (this.state.value.gameState !== 'play') return
    const blocks = this.board.flat()
    if (blocks.every((block) => block.flagged || block.revealed)) {
      if (blocks.some((block) => block.flagged && !block.mine)) {
        this.state.value.gameState = 'lost'
        this.state.value.gametime.pause()
        alert('You cheat')
      } else {
        this.state.value.gameState = 'won'
        this.state.value.gametime.pause()
        alert('You win!')
      }
    }
  }
}
