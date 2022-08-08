<template>
  <button
    :class="getBlockClass(block)"
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
    <template v-else-if="block.revealed || isDev">
      <div v-if="block.mine" i-mdi:mine></div>
      <div v-else>{{ block.adjacentMines }}</div>
    </template>
  </button>
</template>
<script lang="ts" setup>
import { BlockState } from '@/types';
import {isDev} from '@/composables'
defineProps<{ block: BlockState }>();
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
function getBlockClass(block: BlockState) {
  if (!block.revealed) return 'bg-gray-500/10 hover:bg-gray-500';
  return block.mine ? 'text-#fab' : numberColors[block.adjacentMines];
}
</script>
