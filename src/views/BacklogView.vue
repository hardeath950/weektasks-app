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
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { Delete } from "@element-plus/icons-vue";

const issues = ref<any[]>([]);

onMounted(async () => {
  let { data } = await axios.get<any[]>("http://localhost:3000/issues");
  issues.value = data;
});

async function removeIssue(issueId: number) {
  await axios.delete<any[]>("http://localhost:3000/issues/" + issueId);
  issues.value = issues.value.filter((i) => i.id !== issueId);
}
</script>

<style scoped></style>
