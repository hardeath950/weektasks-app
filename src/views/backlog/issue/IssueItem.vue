<template>
  <div class="issue">
    <WkEditable v-model="issueTitle" :editable="editable" />

    <div class="actions">
      <button v-if="editable" @click="updateIssueTitle">
        <el-icon><Check /></el-icon>
      </button>
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
import { axios } from "../../../axios";
import { ref, computed } from "vue";
import { Check, Edit } from "@element-plus/icons-vue";
import type { Issue } from "./issue.model";
import WkEditable from "@/components/form/WkEditable.vue";

let props = defineProps<{
  issue: Issue;
}>();

let emit = defineEmits(["remove", "update:issue"]);

let editable = ref(false);

let issueTitle = computed({
  get: () => props.issue.title,
  set: (title) => emit("update:issue", { ...props.issue, title }),
});

function removeIssue(id: number) {
  emit("remove", id);
}

async function updateIssueTitle() {
  let patch = { title: issueTitle.value };
  await axios.patch("/issues/" + props.issue.id, patch);
  editable.value = false;
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
