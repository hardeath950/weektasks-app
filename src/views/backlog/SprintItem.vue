<template>
  <div class="sprint-topbar">
    <WkEditable v-model="sprintTitle" :editable="editable" />
    <div class="actions">
      <button @click="updateSprintTitle">
        <el-icon><Check /></el-icon>
      </button>
      <button @click="editable = !editable">
        <el-icon><Edit /></el-icon>
      </button>
      <button @click="removeSprint(sprint.id)">
        <el-icon><Delete /></el-icon>
      </button>
    </div>
  </div>
  <div>
    <ul>
      <li v-for="issue in sprintIssues" :key="issue.id">
        {{ issue.title }}
        <button @click="removeIssue(issue.id)">
          <el-icon><Delete /></el-icon>
        </button>
      </li>
    </ul>
  </div>
  <form @submit.prevent="createIssue">
    <input v-model="issueTitle" />
    <button type="submit">
      <el-icon><Plus /></el-icon>
    </button>
  </form>
</template>

<script lang="ts" setup>
import axios from "axios";
import { ref, computed } from "vue";
import type { Sprint } from "./sprint.model";
import WkEditable from "@/components/form/WkEditable.vue";
import { f } from "vitest/dist/index-9f5bc072";

let props = defineProps<{
  sprint: Sprint;
}>();

let emit = defineEmits(["remove", "update:sprint"]);

let sprintTitle = computed({
  get: () => props.sprint.title,
  set: (title) => emit("update:sprint", { ...props.sprint, title }),
});

let sprintIssues = computed({
  get: () => props.sprint.issues,
  set: (issues) => emit("update:sprint", { ...props.sprint, issues }),
});

let editable = ref(false);

async function updateSprintTitle() {}

function removeSprint(id: number) {
  emit("remove", id);
}

let issueTitle = ref("");

async function createIssue() {
  let issue = { title: issueTitle.value, sprint: { id: props.sprint.id } };
  let { data } = await axios.post("http://localhost:3000/issues", issue);
  sprintIssues.value = [...props.sprint.issues, data];
  issueTitle.value = "";
}

async function removeIssue(id: number) {
  await axios.delete("http://localhost:3000/issues/" + id);
  sprintIssues.value = props.sprint.issues.filter((i) => i.id !== id);
}
</script>

<style scoped>
.sprint-topbar {
  display: flex;
}
.actions {
  margin-left: auto;
}
</style>
