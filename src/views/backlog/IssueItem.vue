<template>
  <div class="issue">
    <WkEditable v-model="issueTitle" :editable="editable" />

    <div class="actions">
      <button @click="editable = !editable">
        <el-icon><Edit /></el-icon>
      </button>
      <button @click="removeIssue(issue.id)">
        <el-icon><Delete /></el-icon>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import WkEditable from "@/components/form/WkEditable.vue";
import { Edit } from "@element-plus/icons-vue";
import { ref, computed } from "vue";

let props = defineProps<{
  issue: { id: number; title: string };
}>();

let emit = defineEmits(["remove", "update:issue"]);

let editable = ref(false);

let issueTitle = computed({
  get: () => props.issue.title,
  set: (v) => emit("update:issue", v),
});

function removeIssue(id: number) {
  emit("remove", id);
}
</script>

<style scoped>
.issue {
  display: flex;
}

.actions {
  margin-left: auto;
}
</style>
