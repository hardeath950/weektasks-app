<template>
  <main class="backlog">
    <ul>
      <li v-for="issue in issues" :key="issue.id">
        {{ issue.title }}
        <button @click="removeIssue(issue.id)">
          <el-icon><Delete /></el-icon>
        </button>
      </li>
    </ul>
    <form @submit="createIssue">
      <input v-model="issueTitle" data-testid="issue-title-input" />
      <button data-testid="create-issue-btn">Add</button>
    </form>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { Delete } from "@element-plus/icons-vue";

const issues = ref<any[]>([]);
const issueTitle = ref("");

onMounted(async () => {
  let { data } = await axios.get<any[]>("http://localhost:3000/issues");
  issues.value = data;
});

async function createIssue() {
  const issue = { title: issueTitle.value };
  let { data } = await axios.post<any[]>("http://localhost:3000/issues", issue);
  issues.value.push(data);
  issueTitle.value = "";
}

async function removeIssue(issueId: number) {
  await axios.delete<any[]>("http://localhost:3000/issues/" + issueId);
  issues.value = issues.value.filter((i) => i.id !== issueId);
}
</script>

<style scoped></style>
