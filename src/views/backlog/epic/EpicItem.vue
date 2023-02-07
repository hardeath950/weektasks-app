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

    <EpicIssues :epic="epic" @update:epic="emit('update:epic', $event)" @update:issues="emit('update:issues', $event)"/>

  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { axios } from "../../../axios/axios";
import type { Epic } from "../issue.model";
import WkEditable from "@/components/form/WkEditable.vue";
import EpicIssues from "./EpicIssues.vue";

let props = defineProps<{
  epic: Epic;
  topbarClass?: any;
}>();

let emit = defineEmits(["remove", "update:epic", "update:issues"]);

let epicTitle = computed({
  get: () => props.epic.title,
  set: (title: any) => emit("update:epic", patchEpic({ title })),
});

const editable = ref(false);

function patchEpic(patch: Partial<Epic>) {
  return { ...props.epic, ...patch };
}

async function updateEpicTitle() {
  let patch = { title: epicTitle.value };
  await axios.patch("/epics/" + props.epic.id, patch);
  editable.value = false;
}

function removeEpic(id: number) {
  emit("remove", id);
}
</script>

<style lang="scss" scoped>
.epic-topbar {
  display: flex;
}

.actions {
  margin-left: auto;
}
</style>
