<template>
  <main class="backlog">
    <ul>
      <li v-for="issue in issues" :key="issue.id">
        {{ issue.title }}
        <button>
          <el-icon><Delete /></el-icon>
        </button>
      </li>
    </ul>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { Delete, Plus } from "@element-plus/icons-vue";

const issues = ref<any[]>([]);

onMounted(async () => {
  let { data } = await axios.get<any[]>("http://localhost:3000/issues");
  issues.value = data;
});
</script>

<style scoped></style>
