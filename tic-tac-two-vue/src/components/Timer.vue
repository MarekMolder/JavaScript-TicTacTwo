<script setup lang="ts">
import { type PropType, ref, watch, defineExpose } from 'vue';
import { GameBrain } from '../bll/gamebrain';

const props = defineProps({
  game: {
    type: Object as PropType<GameBrain>,
    required: true,
  },
});

const elapsedTime = ref(0);
const timerRunning = ref(false);
let timerInterval: ReturnType<typeof setInterval> | null = null;

const toggleTimer = () => {
  if (timerRunning.value) {
    clearInterval(timerInterval!);
    timerRunning.value = false;
    props.game.gameState = 'Stopped';
  } else {
    props.game.gameState = 'Playing';
    timerInterval = setInterval(() => elapsedTime.value++, 1000);
    timerRunning.value = true;
  }
};

const resetTimer = () => {
  clearInterval(timerInterval!);
  elapsedTime.value = 0;
  timerRunning.value = false;
  timerInterval = null;
};

watch(() => props.game.gameState, (newState) => {
  if (newState === 'Stopped') {
    clearInterval(timerInterval!);
    timerRunning.value = false;
  }
});

defineExpose({ resetTimer });
</script>

<template>
  <div class="timer-container">
    <div class="timer-display">Time: {{ elapsedTime }}s</div>
    <button class="timer-button" @click="toggleTimer">
      {{ timerRunning ? 'Stop Timer' : 'Start Timer' }}
    </button>
  </div>
</template>

<style scoped>
.timer-container {
  grid-column: 2 / span 1;
  grid-row: 1 / span 1;
  background: rgb(195, 238, 253);
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.5s ease-out;
}

.timer-display {
  font-size: 2rem;
  font-weight: bold;
  color: #0277bd;
  padding: 10px;
  margin-bottom: 15px;
}

.timer-button {
  background: white;
  color: #055fbd;
  border: none;
  padding: 10px 24px;
  font-size: 1.3rem;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.timer-button:hover {
  background: #055fbd;
  color: white;
  transform: scale(1.05);
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
</style>
