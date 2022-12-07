<template>
  <div class="epic">
    <div>
      {{ issue.title }}
      <button @click="removeEpic(issue.id)">
        <el-icon><Delete /></el-icon>
      </button>
    </div>
    <ul>
      <li v-for="issue in issues" :key="issue.id">
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
import { ref } from "vue";
import axios from "axios";
import type { Issue } from "./issue.model";

let props = defineProps<{
  issue: Issue;
  issues: Issue[];
}>();

let emit = defineEmits(["remove", "update:issues"]);

const issueTitle = ref("");

async function createIssue() {
  const issue = { title: issueTitle.value, epic: props.issue };
  let { data } = await axios.post("http://localhost:3000/issues", issue);
  emit("update:issues", [...props.issues, data]);
  issueTitle.value = "";
}

function removeEpic(id: number) {
  emit("remove", "epic", id);
}

async function removeIssue(id: number) {
  await axios.delete("http://localhost:3000/issues/" + id);
  let issues = props.issues.filter((i) => i.id !== id);
  emit("update:issues", issues);
}
</script>
