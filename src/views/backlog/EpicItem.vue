<template>
  <div class="epic">
    <div class="epic-topbar">
      <WkEditable v-model="epicTitle" :editable="editable" />
      <div class="actions">
        <button @click="editable = !editable">
          <el-icon><Edit /></el-icon>
        </button>
      <button @click="removeEpic(epic.id)">
        <el-icon><Delete /></el-icon>
      </button>
    </div>
    </div>
    <ul>
      <li v-for="issue in epic.issues" :key="issue.id">
        {{ issue.title }}
        <button @click="removeIssue(issue.id)">
          <el-icon><Delete /></el-icon>
        </button>
      </li>
    </ul>
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

let props = defineProps<{
  epic: Epic;
}>();

let emit = defineEmits(["remove", "update:epic"]);

let epicTitle = computed({
  get: () => props.epic.title,
  set: (title: any) => emit("update:epic", patchEpic({ title })),
});

const issueTitle = ref("");
const editable = ref(false);

function patchEpic(patch: Partial<Epic>) {
  return { ...props.epic, ...patch };
}

async function createIssue() {
  const issue = { title: issueTitle.value, epic: props.epic };
  let { data } = await axios.post("http://localhost:3000/issues", issue);
  let epic = patchEpic({ issues: [...props.epic.issues, data] });
  emit("update:epic", epic);
  issueTitle.value = "";
}

function removeEpic(id: number) {
  emit("remove", id);
}

async function removeIssue(id: number) {
  await axios.delete("http://localhost:3000/issues/" + id);
  let issues = props.epic.issues.filter((i) => i.id !== id);
  let epic = patchEpic({ issues });
  emit("update:epic", epic);
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
