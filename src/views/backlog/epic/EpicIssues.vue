<template>
    <div class="issues">
      <draggable v-model="epicIssues" item-key="id" tag="ul" group="issues" @change="moveIssue">
        <template #item="{ element: issue, index: i }">
          <li>
            <IssueItem
              v-model:issue="epicIssues[i]"
              @remove="removeIssue(issue.id)"
            />
          </li>
        </template>
        <template #footer v-if="epicHasNoIssue">
          <li class="issue">
            <small>
              <i>Mova uma questão aqui</i>
            </small>
          </li>
        </template>
      </draggable>
      <form @submit.prevent="createIssue" class="create-issue">
        <input v-model="issueTitle" placeholder="Insira uma nova questão"/>
        <button>
          <el-icon><Plus /></el-icon>
        </button>
      </form>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { axios } from "../axios";
import type { Epic } from "../issue/issue.model";
import IssueItem from "../issue/IssueItem.vue";
import draggable from "vuedraggable";

let props = defineProps<{
  epic: Epic;
}>();

let emit = defineEmits(["remove", "update:epic", "update:issues"]);

let epicHasNoIssue = computed(() => props.epic.issues.length === 0);

let epicIssues = computed({
  get: () => props.epic.issues,
  set: (issues: any) => emit("update:issues", issues),
});

const issueTitle = ref("");

async function createIssue() {
  const issue = { title: issueTitle.value };
  let url = `/epics/${props.epic.id}/issues`;
  let { data } = await axios.post(url, issue);
  epicIssues.value = [...props.epic.issues, data];
  issueTitle.value = "";
}

async function removeIssue(id: number) {
  await axios.delete("/issues/" + id);
  epicIssues.value = props.epic.issues.filter((i) => i.id !== id);
}

async function moveIssue({ moved, added, removed }: any) {
  if (added) {
    let { id } = added.element;
    let url = `/backlog/epics/${props.epic.id}/issues/${id}`;
    axios.post(url, { order: added.newIndex });
  }

  if (removed) {
    let { id } = removed.element;
    let url = `/backlog/epics/${props.epic.id}/issues/${id}/soft-remove`;
    axios.delete(url);
  }

  if (moved) {
    let { id } = moved.element;
    let url = `/backlog/epics/${props.epic.id}/issues/${id}/order`
    axios.post(url, { order: moved.newIndex });
  }
}
</script>

<style lang="scss" scoped>
.issues {
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.issue {
  border-bottom: 1px solid #ccc;
  padding: 5px;
}

.create-issue {
  padding: 5px;
  display: flex;
  input {
    width: 100%;
  }
}
</style>
