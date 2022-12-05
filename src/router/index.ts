import BacklogView from "@/views/BacklogView.vue";
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/backlog",
      name: "backlog",
      component: BacklogView,
    },
  ],
});

export default router;
