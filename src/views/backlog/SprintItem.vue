<template>
  <div>
    {{ sprint.title }}
    <button @click="removeSprint(sprint.id)">
      <el-icon><Delete /></el-icon>
    </button>
  </div>
  <form @submit.prevent="createSprint">
    <input v-model="sprintTitle" />
    <button type="submit">
      <el-icon><Plus /></el-icon>
    </button>
  </form>
</template>

<script lang="ts" setup>
import axios from "axios";
import { ref } from "vue";
import type { Issue } from "./issue.model";
import type { Sprint } from "./sprint.model";

let props = defineProps<{
  sprint: Sprint;
  issues: Issue[];
}>();

let emit = defineEmits(["remove", "update:issues"]);

let sprintTitle = ref("");

async function createSprint() {
  let issue = { title: sprintTitle.value, sprint: { id: props.sprint.id } };
  let { data } = await axios.post("http://localhost:3000/issues", issue);
  emit("update:issues", [...props.issues, data]);
}

function removeSprint(id: number) {
  emit("remove", id);
}
</script>
