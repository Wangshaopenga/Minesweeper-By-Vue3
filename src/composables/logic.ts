import { BlockState } from '@/types'
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
export class GamePlay {
  state = ref<BlockState[][]>([])
  mineGenerated = false
  constructor(public width: number, public height: number) {
    this.reset()
  }
  reset() {
    this.mineGenerated = false
    this.state.value = Array.from({ length: this.height }, (_, y) =>
      Array.from(
        { length: this.width },
        (_, x): BlockState => ({
          x,
          y,
          adjacentMines: 0,
        }),
      ),
    )
  }
  updateNumber() {
    this.state.value.forEach((row, y) => {
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
        return this.state.value[yy][xx]
      })
      .filter(Boolean) as BlockState[]
  }
  generateMines(initial: BlockState) {
    for (const row of this.state.value) {
      for (const block of row) {
        if (
          Math.abs(initial.x - block.x) <= 1 ||
          Math.abs(initial.y - block.y) <= 1
        ) {
          continue
        }
        block.mine = Math.random() < 0.2
      }
    }
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
  onLeftClick(block: BlockState) {
    if (!this.mineGenerated) {
      this.mineGenerated = true
      this.generateMines(block)
    }
    this.expendZero(block)
    block.revealed = true
    if (block.mine) alert('BOOOM!')
  }
  onRightClick(block: BlockState) {
    if (block.revealed) return
    block.flagged = !block.flagged
  }
  checkGameState() {
    const blocks = this.state.value.flat()
    if (blocks.every((block) => block.flagged || block.revealed)) {
      if (blocks.some((block) => block.flagged && !block.mine))
        alert('You cheat')
      else alert('You win!')
    }
  }
}
