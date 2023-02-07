<template>
  <main class="backlog">
    <div class="issues">
      <b>Backlog</b>

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
      <form @submit.prevent="createBacklogItem">
        <select v-model="issueTypeTarget">
          <option
            v-for="issueType in issueTypes"
            :key="issueType"
            :value="issueType"
          >
            {{ issueType === "issue" ? "Questão" : "Épica" }}
          </option>
        </select>
        <input
          v-model="issueTitle"
          data-testid="issue-title-input"
          :placeholder="`Crie uma nova ${issueTypeTarget === 'issue' ? 'questão' : 'épica'}`"
        />
        <button data-testid="create-issue-btn">
          <el-icon><Plus /></el-icon>
        </button>
      </form>
    </div>

    <div class="sprints">
      <b>Sprints</b>

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
      <form @submit.prevent="createSprint" class="create-sprint">
        <input v-model="sprintTitle" placeholder="Crie uma nova sprint"/>
        <button>
          <el-icon><Plus /></el-icon>
        </button>
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import EpicItem from "./epic/EpicItem.vue";
import IssueItem from "./issue/IssueItem.vue";
import SprintItem from "./sprint/SprintItem.vue";
import draggable from "vuedraggable";
import { axios } from "../../axiosxios";

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
  let { data } = await axios.get<any[]>("/backlog/items");
  return data.map((issue) => issue.issueType === 'epic' ? asEpic(issue) : asIssue(issue));
}

async function createBacklogItem() {
  let createItemData = { title: issueTitle.value };
  let item = issueTypeTarget.value === "issue"
    ? await createIssue(createItemData)
    : await createEpic(createItemData);
  issues.value.push(item);
  issueTitle.value = "";
}

async function createIssue(item: any) {
  let { data } = await axios.post<any[]>("/backlog/issues", item);
  return asIssue(data);
}

async function createEpic(item: any) {
  let { data } = await axios.post<any[]>("/backlog/epics", item);
  return asEpic(data);
}

async function removeIssue(id: number) {
  await axios.delete("/backlog/issues/" + id);

  issues.value = issues.value.filter(
    (i) => !(i.issueType === "issue" && i.id === id)
  );
}

async function removeEpic(id: number) {
  await axios.delete("/backlog/epics/" + id);

  issues.value = issues.value.filter(
    (i) => !(i.issueType === "epic" && i.id === id)
  );
}

const sprintTitle = ref("");
const sprints = ref<any[]>([]);

onMounted(async () => {
  let { data } = await axios.get<any[]>("/sprints");
  sprints.value = data;
});

async function createSprint() {
  const sprint = { title: sprintTitle.value };
  let { data } = await axios.post("/sprints", sprint);
  data.issues = [];
  sprints.value.push(data);
  sprintTitle.value = "";
}

async function removeSprint(id: number) {
  await axios.delete("/sprints/" + id);
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
    const { id } = added.element;
    const item = { order: added.newIndex };
    axios.post(`/backlog/issues/${id}`, item);
  }

  if (removed) {
    const { id } = removed.element;
    axios.delete(`/backlog/issues/${id}/soft-remove`);
  }

  if (moved) {
    const { issueType, id } = moved.element;
    const item = { order: moved.newIndex };
    axios.post(`/backlog/order/${issueType}/${id}`, item);
  }
}

function moveSprint({ moved }: any) {
  if (moved) {
    let { id } = moved.element;
    let url = `/sprints/${id}/order`;
    axios.post(url, { order: moved.newIndex });
  }
}
</script>

<style lang="scss" scoped>
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

.issue, .epic {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  min-width: 320px;
  margin-bottom: 10px;
}

.sprints {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 0 5px #aaa;
}
.create-sprint {
  display: flex;
  input {
    width: 100%;
  }
}
</style>
