<template>
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
        <template #footer v-if="sprintHasNoIssues">
          <li class="issue">
            <small>
              <i>Mova uma questão aqui</i>
            </small>
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
</template>

<script setup lang="ts">
import { axios } from "../../../axios";
import { ref, computed } from "vue";
import type { Sprint } from "./sprint.model";
import IssueItem from "../issue/IssueItem.vue";
import draggable from "vuedraggable";

let props = defineProps<{
  sprint: Sprint;
}>();

let emit = defineEmits(["update:sprint"]);

let sprintIssues = computed({
  get: () => props.sprint.issues,
  set: (issues) => emit("update:sprint", { ...props.sprint, issues }),
});

let sprintHasNoIssues = computed(() => props.sprint.issues.length === 0);

let hideIssues = ref(false);

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
