<script setup lang="ts">
interface Props {
  board: string[][];
  gridStartX: number;
  gridStartY: number;
}

const props = defineProps<Props>();
defineEmits(['cellClick', 'dragStart', 'dragOver', 'drop']);

const isGridCell = (rowIndex: number, colIndex: number) =>
  rowIndex >= props.gridStartX && rowIndex < props.gridStartX + 3 &&
  colIndex >= props.gridStartY && colIndex < props.gridStartY + 3;
</script>

<template>
  <table class="board">
    <tbody>
    <tr v-for="(row, rowIndex) in props.board" :key="rowIndex">
      <td
        v-for="(cell, colIndex) in row"
        :key="colIndex"
        class="cell"
        :class="{ 'grid-cell': isGridCell(rowIndex, colIndex) }"
        @click="$emit('cellClick', rowIndex, colIndex)"
        @dragstart="$emit('dragStart', $event, rowIndex, colIndex)"
        @dragover.prevent="$emit('dragOver', $event, rowIndex, colIndex)"
        @drop="$emit('drop', $event, rowIndex, colIndex)"
        draggable="true"
      >
        <span v-html="cell || '&nbsp;'"></span>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<style scoped>
.board {
  grid-column: 2 / span 1;
  grid-row: 2 / span 1;
  background-color: black;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  border-collapse: collapse;
}

.cell {
  width: 80px;
  height: 80px;
  background-color: white;
  font-size: 2rem;
  text-align: center;
  border: 4px solid black;
  cursor: pointer;
  vertical-align: middle;
  color: black;
  transition: transform 0.1s ease-in-out;
}

.cell:hover {
  background-color: rgb(0, 188, 212);
  transform: scale(1.05);
}

.grid-cell {
  background-color: rgb(172, 155, 241);
}

.cell:active {
  transform: scale(0.95);
}

td {
  padding: 0;
}
</style>
