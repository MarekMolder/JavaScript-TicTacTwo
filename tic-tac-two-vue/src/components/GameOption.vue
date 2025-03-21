<script setup lang="ts">
import { ref, defineEmits } from 'vue';

const actions = [
  { id: 'placeNew', label: 'Place New Piece' },
  { id: 'moveExisting', label: 'Move Existing Piece' },
  { id: 'moveGrid', label: 'Move Grid' }
];

const selectedAction = ref('placeNew');

const emit = defineEmits(['update-action']);

const updateAction = (action: string) => {
  selectedAction.value = action;
  emit('update-action', action);
};
</script>

<template>
  <div class="game-options">
    <h3>Game Options</h3>
    <div v-for="action in actions" :key="action.id" class="option">
      <input
        type="radio"
        :id="action.id"
        name="gameOption"
        :value="action.id"
        v-model="selectedAction"
        @change="updateAction(action.id)"
      />
      <label :for="action.id">{{ action.label }}</label>
    </div>
  </div>
</template>

<style scoped>
.game-options {
  grid-column: 3 / span 1;
  grid-row: 2 / span 1;
  background: rgb(195, 238, 253);
  padding: 20px;
  border-radius: 12px;
  font-size: 1.2rem;
  text-align: left;
  width: 250px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.5s ease-out;
  color: #0277bd;
}

.option {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  transition: transform 0.2s ease-in-out;
}

.option:hover {
  transform: scale(1.05);
}

input[type="radio"] {
  margin-right: 12px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

input[type="radio"]:checked {
  transform: scale(1.2);
  transition: transform 0.2s ease-in-out;
}

label {
  cursor: pointer;
}

h3 {
  font-size: 1.5rem;
  color: #0277bd;
  text-align: center;
  margin-bottom: 15px;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
