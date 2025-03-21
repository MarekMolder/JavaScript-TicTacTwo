<script setup lang="ts">
import { computed, defineProps } from 'vue';
import { GameBrain } from '@/bll/gamebrain';

const props = defineProps<{ game: GameBrain }>();

const currentPlayer = computed(() => `Current Player: ${props.game.currentPlayer}`);
const remainingPiecesX = computed(() => `Remaining Pieces X: ${props.game.remainingPiecesX}`);
const remainingPiecesO = computed(() => `Remaining Pieces O: ${props.game.remainingPiecesO}`);
</script>

<template>
  <div class="player-info-panel">
    <div class="current-player">{{ currentPlayer }}</div>
    <div class="remaining-pieces-x">{{ remainingPiecesX }}</div>
    <div class="remaining-pieces-o">{{ remainingPiecesO }}</div>
  </div>
</template>

<style scoped>
.player-info-panel {
  grid-column: 1 / span 1;
  grid-row: 2 / span 1;
  background: rgb(195, 238, 253);
  padding: 20px;
  border-radius: 12px;
  font-size: 1.2rem;
  text-align: left;
  width: 220px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-out;
  transition: transform 0.2s ease-in-out;
}

.current-player {
  font-weight: bold;
  font-size: 1.4rem;
  color: #0277bd;
  margin-bottom: 12px;
}

.remaining-pieces-x,
.remaining-pieces-o {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.remaining-pieces-x {
  color: #0277bd;
}

.remaining-pieces-o {
  color: #d32f2f;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.player-info-panel:hover {
  transform: scale(1.05);
}
</style>
