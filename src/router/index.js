import { createWebHistory, createRouter } from "vue-router";
import Dashboard from "../pages/Dashboard";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Dashboard,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
