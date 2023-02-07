<template>
  <div class="sprint">
    <div class="sprint-topbar">
      <button class="toggle-issues" @click="hideIssues = !hideIssues">
        <el-icon><ArrowDown /></el-icon>
      </button>
      <WkEditable v-model="sprintTitle" :editable="editable" />
      <div class="actions">
        <button v-if="editable" @click="updateSprintTitle">
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
    <SprintIssues :sprint="sprint" @update:sprint="emit('update:sprint', $event)"/>
  </div>
</template>

<script lang="ts" setup>
import { axios } from "../../../axios";
import { ref, computed } from "vue";
import type { Sprint } from "./sprint.model";
import WkEditable from "@/components/form/WkEditable.vue";
import { ArrowDown } from "@element-plus/icons-vue";
import SprintIssues from './SprintIssues.vue';

let props = defineProps<{
  sprint: Sprint;
}>();

let emit = defineEmits(["remove", "update:sprint"]);

let sprintTitle = computed({
  get: () => props.sprint.title,
  set: (title) => emit("update:sprint", { ...props.sprint, title }),
});

let hideIssues = ref(false);

let editable = ref(false);

async function updateSprintTitle() {
  let patch = { title: sprintTitle.value };
  await axios.patch("/sprints/" + props.sprint.id, patch);
  editable.value = false;
}

function removeSprint(id: number) {
  emit("remove", id);
}
</script>

<style scoped lang="scss">
.sprint {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  min-width: 320px;
  margin-bottom: 10px;
}
.sprint-topbar {
  display: flex;
}
.actions {
  margin-left: auto;
}
</style>
