// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/LoginPage.vue";
import Register from "../views/RegisterPage.vue";
import Dashboard from "../views/DashboardPage.vue";

const routes = [
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/dashboard", component: Dashboard, meta: { requiresAuth: true } },
  { path: "/", redirect: "/dashboard" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard เพื่อปกป้องเส้นทางแดชบอร์ด
import { auth } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  onAuthStateChanged(auth, (user) => {
    if (requiresAuth && !user) {
      next("/login");
    } else {
      next();
    }
  });
});

export default router;
