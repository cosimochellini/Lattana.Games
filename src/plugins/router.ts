import { isAuthorized } from "@/services/authService";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import {
  DEFAULT_LOCALE,
  setI18nLanguage,
  SUPPORT_LOCALES,
  loadLocaleMessages,
} from "./i18n";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: { path: "/it/matches" },
  },
  {
    path: "/:locale",
    name: "root",
    redirect: { path: "/it/matches" },
  },
  {
    path: "/:locale/login",
    name: "login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/:locale/log-out",
    name: "logout",
    component: () => import("../views/Logout.vue"),
  },
  {
    path: "/:locale/add-trump",
    name: "addTrump",
    component: () => import("../views/AddTrumpMatch.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/:locale/matches",
    name: "matches",
    component: () => import("../views/TrumpMatches.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/:locale/profile",
    name: "profile",
    component: () => import("../views/Profile.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/:locale/trumpMatch",
    name: "trumpMatch",
    component: () => import("../views/TrumpMatch/Stats.vue"),

    children: [
      {
        path: "stats",
        name: "TrumpMatchesStats",
        component: () => import("../views/TrumpMatch/Stats.vue"),
      },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: "/:catchAll(.*)",
    redirect() {
      return "/it/";
    },
  },
];

export function setupRouter(i18n: any) {
  const locale = i18n.global.locale.value;

  // create router instance
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  // navigation guards
  router.beforeEach(async (to, from, next) => {
    const paramsLocale = to.params.locale as string;

    if (to.meta.requiresAuth && !isAuthorized()) return { path: "/login" };

    // use locale if paramsLocale is not in SUPPORT_LOCALES
    if (!SUPPORT_LOCALES.includes(paramsLocale)) {
      return next(`/${locale}`);
    }

    // load locale messages
    if (!i18n.global.availableLocales.includes(paramsLocale)) {
      await loadLocaleMessages(i18n, paramsLocale);
    }

    // set i18n language
    setI18nLanguage(i18n, paramsLocale);

    return next();
  });

  return router;
}
