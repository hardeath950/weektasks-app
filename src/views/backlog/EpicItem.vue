<template>
  <div class="epic">
    {{ issue.title }}
    <button @click="removeEpic(issue.id)">
      <el-icon><Delete /></el-icon>
    </button>
  </div>
</template>

<script lang="ts" setup>
import type { Issue } from "./issue.model";

defineProps<{
  issue: Issue;
}>();

let emit = defineEmits(["remove"]);

function removeEpic(id: number) {
  emit("remove", "epic", id);
}
</script>
