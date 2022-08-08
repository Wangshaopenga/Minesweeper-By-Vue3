<template>
  <div>
    Minesweeper
    <div p5 select-none>
      <div
        flex="~"
        items-center
        justify-center
        v-for="(row, x) in play.state.value"
        :key="x"
      >
        <MineBlock
          v-for="(block, y) in row"
          :key="y"
          :block="block"
          @click.right.prevent="play.onRightClick(block)"
          @click.left="play.onLeftClick(block)"
        />
      </div>
    </div>
    <div>
      <button btn @click="toggleDev">{{ !isDev ? 'NORMAL' : 'DEV' }}</button>
      <button btn @click="play.reset">RESET</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import MineBlock from '@/components/MineBlock.vue'
import { isDev, toggleDev, GamePlay } from '@/composables'
const play = new GamePlay(10, 10)
</script>
