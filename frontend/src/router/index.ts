import { createRouter, createWebHistory } from "vue-router";
import Layout from "@/components/_Layout/Layout.vue";
import Home from "@/pages/Home.vue";
import Characters from "@/pages/Characters.vue";
import Card from "@/pages/Card.vue";
import Profile from "@/pages/Profile.vue";
import Debug from "@/pages/Debug.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Layout,
      children: [
        { path: "", component: Home },
        { path: "characters", component: Characters },
        { path: "card", component: Card },
        { path: "profile", component: Profile },
        { path: "debug", component: Debug },
      ],
    },
  ],
});

export default router;
