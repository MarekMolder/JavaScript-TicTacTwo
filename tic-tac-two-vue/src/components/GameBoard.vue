<script setup lang="ts">
interface Props {
  board: string[][];
  gridStartX: number;
  gridStartY: number;
}

const props = defineProps<Props>();
defineEmits(['cellClick', 'dragStart', 'dragOver', 'drop']);
</script>

<template>
  <table class="board">
    <tbody>
    <tr v-for="(row, indexRow) in props.board" :key="indexRow">
      <td
        v-for="(cel, indexCol) in row"
        :key="indexCol"
        class="cell"
        :class="{
            'grid-cell': indexRow >= props.gridStartX && indexRow < props.gridStartX + 3 &&
                        indexCol >= props.gridStartY && indexCol < props.gridStartY + 3
          }"
        @click="$emit('cellClick', indexRow, indexCol)"
        @dragstart="$emit('dragStart', $event, indexRow, indexCol)"
        @dragover.prevent="$emit('dragOver', $event, indexRow, indexCol)"
        @drop="$emit('drop', $event, indexRow, indexCol)"
        draggable="true"
      >
        <span v-html="cel === '' ? '&nbsp;' : cel"></span>
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
