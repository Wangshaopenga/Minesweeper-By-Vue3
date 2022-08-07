<template>
  <div>
    Minesweeper
    <div p5 select-none>
      <div
        flex="~"
        items-center
        justify-center
        v-for="(row, x) in state"
        :key="x"
      >
        <button
          :class="getBlockClass(block)"
          @click.right.prevent="onRightClick(block)"
          @click.left="onLeftClick(block)"
          v-for="(block, y) in row"
          :key="y"
          w-8
          h-8
          border="1 gray-500/15"
          flex="~"
          items-center
          justify-center
          m="0.5"
        >
          <template v-if="block.flagged">
            <div i-mdi:flag text-red></div>
          </template>
          <template v-else-if="block.revealed || dev">
            <div v-if="block.mine" i-mdi:mine></div>
            <div v-else>{{ block.adjacentMines }}</div>
          </template>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface BlockState {
  x: number;
  y: number;
  revealed?: boolean;
  mine?: boolean;
  flagged?: boolean;
  adjacentMines: number;
}
const WIDTH: number = 5;
const HEIGHT: number = 5;
const state = $ref(
  Array.from({ length: HEIGHT }, (_, y) =>
    Array.from(
      { length: WIDTH },
      (_, x): BlockState => ({
        x,
        y,
        adjacentMines: 0,
      }),
    ),
  ),
);
const directions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
];
const numberColors = [
  'text-transparent',
  'text-blue-500',
  'text-green-500',
  'text-yellow-500',
  'text-orange-500',
  'text-red-500',
  'text-purple-500',
  'text-pink-500',
  'text-teal-500',
];
let mineGenerate = false;
let dev = true;
function getBlockClass(block: BlockState) {
  if (!block.revealed) return 'bg-gray-500/10 hover:bg-gray-500';
  return block.mine ? 'text-#fab' : numberColors[block.adjacentMines];
}
function updateNumber() {
  state.forEach((row, y) => {
    row.forEach((block, x) => {
      if (block.mine) return;
      getSiblings(block).forEach((item) => {
        if (item.mine) block.adjacentMines++;
      });
    });
  });
}
function getSiblings(block: BlockState) {
  return directions
    .map(([dx, dy]) => {
      const xx = block.x + dx;
      const yy = block.y + dy;
      if (xx < 0 || xx >= WIDTH || yy < 0 || yy >= HEIGHT) return undefined;
      return state[yy][xx];
    })
    .filter(Boolean) as BlockState[];
}
function generateMines(initial: BlockState) {
  for (const row of state) {
    for (const block of row) {
      if (
        Math.abs(initial.x - block.x) <= 1 ||
        Math.abs(initial.y - block.y) <= 1
      ) {
        continue;
      }
      block.mine = Math.random() < 0.2;
    }
  }
  updateNumber();
}
function expendZero(block: BlockState) {
  if (block.adjacentMines) return;
  getSiblings(block).forEach((item) => {
    if (!item.revealed) {
      item.flagged = false;
      item.revealed = true;
      expendZero(item);
    }
  });
}
function onLeftClick(block: BlockState) {
  if (!mineGenerate) {
    mineGenerate = true;
    generateMines(block);
  }
  expendZero(block);
  block.revealed = true;
  if (block.mine) alert('BOOOM!');
}
function onRightClick(block: BlockState) {
  // console.log(1);
  if (block.revealed) return;
  block.flagged = !block.flagged;
}
function checkGameState() {
  if (!mineGenerate) return;
  const blocks = state.flat();
  if (blocks.every((block) => block.flagged || block.revealed)) {
    if (blocks.some((block) => block.flagged && !block.mine))
      alert('You cheat');
    else alert('You win!');
  }
}
watchEffect(checkGameState);
</script>
