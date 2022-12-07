<template>
  <div class="epic">
    <div>
      {{ issue.title }}
      <button @click="removeEpic(issue.id)">
        <el-icon><Delete /></el-icon>
      </button>
    </div>
    <form @submit.prevent="createIssue">
      <input v-model="issueTitle" />
      <button>
        <el-icon><Plus /></el-icon>
      </button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import axios from "axios";
import type { Issue } from "./issue.model";

let props = defineProps<{
  issue: Issue;
}>();

let emit = defineEmits(["remove"]);

const issueTitle = ref("");

async function createIssue() {
  const issue = { title: issueTitle.value, epic: props.issue };
  await axios.post<any[]>("http://localhost:3000/issues", issue);
  issueTitle.value = "";
}

function removeEpic(id: number) {
  emit("remove", "epic", id);
}
</script>
