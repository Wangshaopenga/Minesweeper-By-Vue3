<template>
  <div>
    Minesweeper
    <div flex="~" justify-center p1>
      <button m1 btn @click="newGame('easy')">New Game</button>
      <button m1 btn @click="newGame('easy')">Easy</button>
      <button m1 btn @click="newGame('medium')">Medium</button>
      <button m1 btn @click="newGame('hard')">Hard</button>
      <button m1 btn @click="toggleDev">{{ !isDev ? 'NORMAL' : 'DEV' }}</button>
    </div>
    <div flex="~ gap-10" justify-center>
      <div font-mono text-2xl flex="~ gap-1" items-center>
        <div i-carbon:alarm></div>
        {{ play.state.value.gametime.counter }}
      </div>
      <div font-mono text-2xl flex="~ gap-1" items-center>
        <div i-mdi:mine></div>
        {{ mineRest }}
      </div>
    </div>
    <div p1 select-none w-full overflow-auto>
      <div flex="~" items-center justify-center v-for="(row, x) in play.board" :key="x">
        <MineBlock v-for="(block, y) in row" :key="y" :block="block" @click.right.prevent="play.onRightClick(block)"
          @click.left="play.onLeftClick(block)" @dblclick="play.autoExpand(block)" />
      </div>
    </div>
  </div>
  <Confetti :passed="play.state.value.gameState === 'won'" />
  <button btn @click="play.state.value.gameState = 'won'">123</button>
</template>

<script setup lang="ts">
import MineBlock from '@/components/MineBlock.vue'
import { isDev, toggleDev, GamePlay } from '@/composables'
import Confetti from '@/components/Confetti.vue'
const play = new GamePlay(9, 9, 10)
const mineRest = $computed(() => {
  if (!play.state.value.mineGenerated) return play.mines
  return play.blocks.reduce((a, b) => a - (b.flagged ? 1 : 0), play.mines)
})
watchEffect(() => {
  play.checkGameState()
})
function newGame(difficulty: 'easy' | 'medium' | 'hard') {
  switch (difficulty) {
    case 'easy':
      play.reset(9, 9, 10)
      break
    case 'medium':
      play.reset(16, 16, 40)
      break
    case 'hard':
      play.reset(30, 20, 120)
      break
    default:
      break
  }
}
</script>
