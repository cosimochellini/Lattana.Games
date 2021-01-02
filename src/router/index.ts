import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { isAuthorized } from "@/services/authService";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/matches",
    name: "Home",
    component: () => import("../views/Home.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/log-out",
    name: "Logout",
    component: () => import("../views/Logout.vue"),
  },
  {
    path: "/add-trump",
    name: "AddTrump",
    component: () => import("../views/AddTrumpMatch.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/matches",
    name: "Matches",
    component: () => import("../views/TrumpMatches.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/Profile.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from) => {
  // instead of having to check every route record with
  // to.matched.some(record => record.meta.requiresAuth)
  if (to.meta.requiresAuth && !isAuthorized()) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    return {
      path: "/login",
      // save the location we were at to come back later
      query: { redirect: to.fullPath },
    };
  }
});
export default router;
