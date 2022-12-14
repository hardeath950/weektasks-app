<template>
  <div class="epic">
    <div class="epic-topbar" :class="props.topbarClass">
      <WkEditable v-model="epicTitle" :editable="editable" />
      <div class="actions">
        <button v-if="editable" @click="updateEpicTitle">
          <el-icon><Check /></el-icon>
        </button>
        <button @click="editable = !editable">
          <el-icon><Edit /></el-icon>
        </button>
        <button @click="removeEpic(epic.id)">
          <el-icon><Delete /></el-icon>
        </button>
      </div>
    </div>
    <draggable v-model="epicIssues" item-key="id" tag="ul" group="issues">
      <template #item="{ element: issue, index: i }">
        <li>
          <IssueItem
            v-model:issue="epicIssues[i]"
            @remove="removeIssue(issue.id)"
          />
        </li>
      </template>
    </draggable>
    <form @submit.prevent="createIssue">
      <input v-model="issueTitle" />
      <button>
        <el-icon><Plus /></el-icon>
      </button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import axios from "axios";
import type { Epic } from "./issue.model";
import WkEditable from "@/components/form/WkEditable.vue";
import IssueItem from "./IssueItem.vue";
import draggable from "vuedraggable";

let props = defineProps<{
  epic: Epic;
  topbarClass?: any;
}>();

let emit = defineEmits(["remove", "update:epic"]);

let epicTitle = computed({
  get: () => props.epic.title,
  set: (title: any) => emit("update:epic", patchEpic({ title })),
});

let epicIssues = computed({
  get: () => props.epic.issues,
  set: (issues: any) => emit("update:epic", patchEpic({ issues })),
});

const issueTitle = ref("");
const editable = ref(false);

function patchEpic(patch: Partial<Epic>) {
  return { ...props.epic, ...patch };
}

async function updateEpicTitle() {
  let patch = { title: epicTitle.value };
  await axios.patch("http://localhost:3000/epics/" + props.epic.id, patch);
  editable.value = false;
}

function removeEpic(id: number) {
  emit("remove", id);
}

async function createIssue() {
  const issue = { title: issueTitle.value };
  let url = `http://localhost:3000/epics/${props.epic.id}/issues`;
  let { data } = await axios.post(url, issue);
  epicIssues.value = [...props.epic.issues, data];
  issueTitle.value = "";
}

async function removeIssue(id: number) {
  await axios.delete("http://localhost:3000/issues/" + id);
  epicIssues.value = props.epic.issues.filter((i) => i.id !== id);
}
</script>

<style scoped>
.epic-topbar {
  display: flex;
}

.actions {
  margin-left: auto;
}
</style>
