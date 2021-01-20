import { isAuthorized } from "@/services/authService";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import {
  DEFAULT_LOCALE,
  SUPPORT_LOCALES,
  setI18nLanguage,
  loadLocaleMessages,
} from "./i18n";

const routes: RouteRecordRaw[] = [
  {
    path: "",
    redirect: { name: "trumpNew", params: { locale: DEFAULT_LOCALE } },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    redirect: { name: "trumpNew", params: { locale: DEFAULT_LOCALE } },
  },
  {
    path: "/:locale",
    name: "root",
    component: () => import("../views/layouts/DefaultLayout.vue"),
    children: [
      {
        path: "trump",
        name: "trump",
        component: () => import("../views/trump/Index.vue"),
        children: [
          {
            path: "new",
            name: "trumpNew",
            component: () => import("../views/trump/New.vue"),
            meta: { requiresAuth: true },
          },
          {
            path: "history",
            name: "trumpHistory",
            component: () => import("../views/trump/History.vue"),
            meta: { requiresAuth: true },
          },
          {
            path: "stats",
            name: "trumpStats",
            component: () => import("../views/trump/Stats.vue"),

            meta: { requiresAuth: true },
          },
        ],
      },
      {
        path: "secretHitler",
        name: "secretHitler",
        component: () => import("../views/secretHitler/Index.vue"),
        children: [
          {
            path: "new",
            name: "secretHitlerNew",
            component: () => import("../views/secretHitler/New.vue"),
            meta: { requiresAuth: true },
          },
          {
            path: "history",
            name: "secretHitlerHistory",
            component: () => import("../views/secretHitler/History.vue"),
            meta: { requiresAuth: true },
          },
          {
            path: "stats",
            name: "secretHitlerStats",
            component: () => import("../views/secretHitler/Stats.vue"),
            meta: { requiresAuth: true },
          },
        ],
      },
      {
        path: "login",
        name: "login",
        component: () => import("../views/Login.vue"),
      },
      {
        path: "logout",
        name: "logout",
        component: () => import("../views/Logout.vue"),
      },
      {
        path: "profile",
        name: "profile",
        component: () => import("../views/Profile.vue"),
        meta: { requiresAuth: true },
      },
    ],
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

    if (to.meta.requiresAuth && !isAuthorized()) next({ path: "/it/login" });

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
