<template>
  <main class="backlog">
    <div class="issues">
      <draggable
        v-model="issues"
        item-key="id"
        tag="ul"
        handle=".draggable-handle"
        group="issues"
        :move="canMoveBacklogItemToSprint"
        @change="moveBacklogItem"
      >
        <template #item="{ element: issue, index: i }">
          <li>
            <EpicItem
              v-if="issue.issueType === 'epic'"
              :epic="issues[i]"
              @update:issues="issue.issues = $event"
              topbarClass="draggable-handle"
              @remove="removeEpic"
            />
            <IssueItem
              v-else
              v-model:issue="issues[i]"
              class="draggable-handle"
              @remove="removeIssue"
            />
          </li>
        </template>
      </draggable>
      <form @submit.prevent="createIssue">
        <select v-model="issueTypeTarget">
          <option
            v-for="issueType in issueTypes"
            :key="issueType"
            :value="issueType"
          >
            {{ issueType === "issue" ? "Questão" : "Épica" }}
          </option>
        </select>
        <input v-model="issueTitle" data-testid="issue-title-input" />
        <button data-testid="create-issue-btn">
          <el-icon><Plus /></el-icon>
        </button>
      </form>
    </div>

    <div class="sprints">
      <draggable v-model="sprints" item-key="id" tag="ul" group="sprints" @change="moveSprint">
        <template #item="{ element: sprint, index: i }">
          <li>
            <SprintItem
              v-model:sprint="sprints[i]"
              @remove="removeSprint(sprint.id)"
            />
          </li>
        </template>
      </draggable>
      <form @submit.prevent="createSprint">
        <input v-model="sprintTitle" />
        <button>
          <el-icon><Plus /></el-icon>
        </button>
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import EpicItem from "./EpicItem.vue";
import IssueItem from "./IssueItem.vue";
import SprintItem from "./SprintItem.vue";
import draggable from "vuedraggable";

const issues = ref<any[]>([]);
const issueTitle = ref("");

type IssueType = "issue" | "epic";
const issueTypes = ["issue", "epic"];
const issueTypeTarget = ref<IssueType>("issue");

const asIssue = (issue: any) => ({ issueType: "issue" as IssueType, ...issue });
const asEpic = (issue: any) => ({
  issueType: "epic" as IssueType,
  ...issue,
  issues: issue.issues || [],
});

onMounted(async () => {
  issues.value = await fetchBacklog();
});

async function fetchBacklog() {
  let { data } = await axios.get<any[]>("http://localhost:3000/backlog/items");
  return data.map((issue) => issue.issueType === 'epic' ? asEpic(issue) : asIssue(issue));
}

async function createIssue() {
  const issue = { title: issueTitle.value };
  let response;

  if (issueTypeTarget.value === "issue")
    response = await axios
      .post<any[]>("http://localhost:3000/backlog/issues", issue)
      .then((res) => asIssue(res.data));

  if (issueTypeTarget.value === "epic") {
    response = await axios
      .post<any[]>("http://localhost:3000/backlog/epics", issue)
      .then((res) => asEpic(res.data));
  }

  issues.value.push(response);
  issueTitle.value = "";
}

async function removeIssue(id: number) {
  await axios.delete("http://localhost:3000/backlog/issues/" + id);

  issues.value = issues.value.filter(
    (i) => !(i.issueType === "issue" && i.id === id)
  );
}

async function removeEpic(id: number) {
  await axios.delete("http://localhost:3000/backlog/epics/" + id);

  issues.value = issues.value.filter(
    (i) => !(i.issueType === "epic" && i.id === id)
  );
}

const sprintTitle = ref("");
const sprints = ref<any[]>([]);

onMounted(async () => {
  let { data } = await axios.get<any[]>("http://localhost:3000/sprints");
  sprints.value = data;
});

async function createSprint() {
  const sprint = { title: sprintTitle.value };
  let { data } = await axios.post("http://localhost:3000/sprints", sprint);
  data.issues = [];
  sprints.value.push(data);
  sprintTitle.value = "";
}

async function removeSprint(id: number) {
  await axios.delete("http://localhost:3000/sprints/" + id);
  sprints.value = sprints.value.filter((s) => s.id !== id);
}

function canMoveBacklogItemToSprint({ draggedContext, relatedContext }: any) {
  let draggedItem = draggedContext.element;
  let dropzone = relatedContext.component.$attrs["data-dropzone"];
  return (
    dropzone !== "sprint" ||
    (dropzone === "sprint" && draggedItem.issueType === "issue")
  );
}

function moveBacklogItem({moved, added, removed}: any) {
  if (added) {
    let { id } = added.element;
    let url = `http://localhost:3000/backlog/issues/${id}`;
    axios.post(url, { order: added.newIndex });
  }

  if (moved) {
    let { issueType, id } = moved.element;
    let url = `http://localhost:3000/backlog/order/${issueType}/${id}`
    axios.post(url, { order: moved.newIndex });
  }
}

function moveSprint({ moved }: any) {
  if (moved) {
    let { id } = moved.element;
    let url = `http://localhost:3000/sprints/${id}/order`;
    axios.post(url, { order: moved.newIndex });
  }
}
</script>

<style scoped>
.backlog {
  display: flex;
  gap: 20px;
}

.issues {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 0 5px #aaa;
}

.sprints {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 0 5px #aaa;
}
</style>
