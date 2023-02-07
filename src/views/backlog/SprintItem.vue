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
    <div class="issues" :class="{ hide: hideIssues }">
      <draggable
        v-model="sprintIssues"
        item-key="id"
        tag="ul"
        data-dropzone="sprint"
        group="issues"
        @change="moveIssue"
      >
        <template #item="{ element: issue, index: i }">
          <li>
            <IssueItem
              v-model:issue="sprintIssues[i]"
              @remove="removeIssue(issue.id)"
            />
          </li>
        </template>
      </draggable>
      <form @submit.prevent="createIssue" class="create-issue">
        <input v-model="issueTitle" placeholder="Insira uma nova questão"/>
        <button type="submit">
          <el-icon><Plus /></el-icon>
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { axios } from "./axios";
import { ref, computed } from "vue";
import type { Sprint } from "./sprint.model";
import WkEditable from "@/components/form/WkEditable.vue";
import IssueItem from "./IssueItem.vue";
import { ArrowDown } from "@element-plus/icons-vue";
import draggable from "vuedraggable";

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

let hideIssues = ref(true);

let editable = ref(false);

async function updateSprintTitle() {
  let patch = { title: sprintTitle.value };
  await axios.patch("/sprints/" + props.sprint.id, patch);
  editable.value = false;
}

function removeSprint(id: number) {
  emit("remove", id);
}

let issueTitle = ref("");

async function createIssue() {
  let issue = { title: issueTitle.value };
  let url = `/sprints/${props.sprint.id}/issues`;
  let { data } = await axios.post(url, issue);
  sprintIssues.value = [...props.sprint.issues, data];
  issueTitle.value = "";
}

async function removeIssue(id: number) {
  await axios.delete("/issues/" + id);
  sprintIssues.value = props.sprint.issues.filter((i) => i.id !== id);
}

async function moveIssue({ moved, added, removed }: any) {
  if (added) {
    let { id } = added.element;
    let url = `/sprints/${props.sprint.id}/issues/${id}`;
    axios.post(url, { order: added.newIndex });
  }

  if (removed) {
    let { id } = removed.element;
    let url = `/sprints/${props.sprint.id}/issues/${id}`;
    axios.delete(url);
  }

  if (moved) {
    let { id } = moved.element;
    let url = `/sprints/${props.sprint.id}/issues/${id}/order`;
    axios.post(url, { order: moved.newIndex });
  }
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
.issues {
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.issue {
  border-bottom: 1px solid #ccc;
  padding: 5px;
}
.issues.hide {
  display: none;
}
.create-issue {
  padding: 5px;
  display: flex;
  input {
    width: 100%;
  }
}
</style>
