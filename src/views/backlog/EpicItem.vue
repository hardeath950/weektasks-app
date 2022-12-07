<template>
  <div class="epic">
    {{ issue.title }}
    <button @click="removeEpic(issue.id)">
      <el-icon><Delete /></el-icon>
    </button>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  issue: { id: number; title: string };
}>();

let emit = defineEmits(["remove"]);

function removeEpic(id: number) {
  emit("remove", { issueType: "epic", id });
}
</script>
