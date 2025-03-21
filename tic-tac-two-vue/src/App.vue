<script setup lang="ts">
import { reactive, ref } from 'vue';
import { GameBrain } from './bll/gamebrain';
import GameBoard from './components/GameBoard.vue';
import GameOptions from './components/GameOption.vue';
import Timer from './components/Timer.vue';
import PlayerInfoPanel from './components/PlayerInfoPanel.vue';

const game = reactive(new GameBrain());
const draggedPiece = ref<{ x: number; y: number } | null>(null);

const timer = ref<typeof Timer | null>(null);

const winner = ref<string | null>(null);

const stopGame = (winnerName: string) => {
  game.gameState = 'Stopped';
  winner.value = winnerName;
  if (timer.value) {
    timer.value.resetTimer();
  }
};

const updateAction = (action: string) => {
  game.selectedAction = action;
};

const handleCellClick = (x: number, y: number) => {
  if (game.gameState === 'Stopped' || winner.value === "X" || winner.value === "O") {
    return;
  }
  if (game.selectedAction === 'placeNew') {
    if ((game.currentPlayer === 'O' && game.remainingPiecesO > 0) ||
      (game.currentPlayer === 'X' && game.remainingPiecesX > 0)) {
      game.makeMove(x, y);
      const winnerName = game.checkWin();
      if (winnerName) {
        stopGame(winnerName);
      }
    }
  } else if (game.selectedAction === 'moveGrid') {
    game.moveGrid(x, y);
  }
};

const handleDrop = (event: DragEvent, x: number, y: number) => {
  if (game.gameState === 'Stopped' || winner.value === "X" || winner.value === "O") {
    return;
  }

  if (game.selectedAction !== 'moveExisting') return;

  if (draggedPiece.value) {
    game.moveExistingPiece(draggedPiece.value.x, draggedPiece.value.y, x, y);
    draggedPiece.value = null;
    const winnerName = game.checkWin();
    if (winnerName) {
      stopGame(winnerName);
    }
  }
};

const resetGame = () => {
  game.resetGame();
  winner.value = null;

  if (timer.value) {
    timer.value.resetTimer();
  }
};

</script>

<template>
  <div class="game-container">
    <GameOptions @update-action="updateAction" />
    <PlayerInfoPanel :game="game" />

    <GameBoard
      :board="game.board"
      :gridStartX="game.gridStartX"
      :gridStartY="game.gridStartY"
      @cell-click="handleCellClick"
      @drag-start="(event, x, y) => draggedPiece = { x, y }"
      @drag-over="(event, x, y) => event.preventDefault()"
      @drop="handleDrop"
    />

    <Timer ref="timer" :game="game" />

    <div v-if="winner" class="winner-display">
      <h2>{{ winner }} wins!</h2>
    </div>

    <button @click="resetGame" class="reset-button">Reset Game</button>
  </div>
</template>

<style scoped>
.game-container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto 1fr auto;
  height: 96vh;
  align-items: center;
  justify-items: center;
  padding: 20px;
  gap: 20px;
  background: linear-gradient(135deg, #1e88e5, #00bcd4);
  color: white;
}

.winner-display {
  color: #ffeb3b;
  font-size: 30px;
  font-weight: bold;
  margin-top: 20px;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.4);
  animation: winnerAnimation 1s ease-out;
}

@keyframes winnerAnimation {
  0% {
    transform: scale(1);
    opacity: 0;
  }
  100% {
    transform: scale(1.2);
    opacity: 1;
  }
}

button {
  background-color: #00bcd4;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 20px;
}

button:hover {
  background-color: #26a69a;
}

button:active {
  background-color: #00796b;
}

.reset-button {
  grid-column: 2 / span 1;
  grid-row: 3 / span 1;
  background: white;
  color: #055fbd;
  border: none;
  padding: 12px 24px;
  font-size: 1.2rem;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.reset-button:hover {
  background: #055fbd;
  color: white;
  transform: scale(1.05);
}

.reset-button:active {
  background: #26a69a;
  color: white;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -60%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

</style>
