<template>
  {{ sprint.title }}
  <button @click="removeSprint(sprint.id)">
    <el-icon><Delete /></el-icon>
  </button>
</template>

<script lang="ts" setup>
import type { Sprint } from "./sprint.model";

defineProps<{
  sprint: Sprint;
}>();

let emit = defineEmits(["remove"]);

function removeSprint(id: number) {
  emit("remove", id);
}
</script>
