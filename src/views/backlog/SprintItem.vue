<template>
  <div>
    {{ sprint.title }}
    <button @click="removeSprint(sprint.id)">
      <el-icon><Delete /></el-icon>
    </button>
  </div>
  <form @submit.prevent="createSprint">
    <input v-model="sprintTitle" />
    <button type="submit">
      <el-icon><Plus /></el-icon>
    </button>
  </form>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { Sprint } from "./sprint.model";

defineProps<{
  sprint: Sprint;
}>();

let emit = defineEmits(["remove"]);

let sprintTitle = ref("");

function createSprint() {}

function removeSprint(id: number) {
  emit("remove", id);
}
</script>
