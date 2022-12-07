<template>
  <div class="issue">
    {{ issue.title }}
    <button @click="removeIssue(issue.id)">
      <el-icon><Delete /></el-icon>
    </button>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  issue: { id: number; title: string };
}>();

let emit = defineEmits(["remove"]);

function removeIssue(id: number) {
  emit("remove", { issueType: "issue", id });
}
</script>
