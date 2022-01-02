import { i18n } from "@/instances/i18n";
import { auth } from "@/services/auth.service";
import { games, role } from "@/constants";
import { overlay } from "@/services/overlay.service";
import { currentLanguage } from "@/services/language.service";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { SUPPORT_LOCALES, setI18nLanguage, loadLocaleMessages, Languages } from "./i18n";

const routes: RouteRecordRaw[] = [
  {
    path: "",
    redirect: {
      name: "secretHitlerHistory",
      params: { locale: currentLanguage.value },
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    redirect: {
      name: "trumpHistory",
      params: { locale: currentLanguage.value },
    },
  },
  {
    path: "/:locale",
    name: "root",
    component: () => import("../views/layouts/DefaultLayout.vue"),
    children: [
      {
        path: games.trump,
        name: games.trump,
        component: () => import("../views/trump/Index.vue"),
        meta: { requiresAuth: true },
        children: [
          {
            path: "history",
            name: "trumpHistory",
            component: () => import("../views/trump/History.vue"),
          },
          {
            path: "new",
            name: "trumpNew",
            component: () => import("../views/trump/New.vue"),
            meta: { requiresAuth: true, roles: [role.editor] },
          },
          {
            path: "stats",
            name: "trumpStats",
            component: () => import("../views/trump/Stats.vue"),
          },
          {
            path: "rankings",
            name: "trumpRankings",
            component: () => import("../views/trump/rankings/Index.vue"),
          },
          {
            path: "edit/:id",
            name: "trumpEdit",
            component: () => import("../views/trump/Edit.vue"),
            meta: { requiresAuth: true, roles: [role.editor] },
          },
        ],
      },
      {
        path: games.secretHitler,
        name: games.secretHitler,
        component: () => import("../views/secretHitler/Index.vue"),
        meta: { requiresAuth: true },
        children: [
          {
            path: "history",
            name: "secretHitlerHistory",
            component: () => import("../views/secretHitler/History.vue"),
          },
          {
            path: "new",
            name: "secretHitlerNew",
            component: () => import("../views/secretHitler/New.vue"),
            meta: { requiresAuth: true, roles: [role.editor] },
          },
          {
            path: "stats",
            name: "secretHitlerStats",
            component: () => import("../views/secretHitler/Stats.vue"),
          },
          {
            path: "rankings",
            name: "secretHitlerRankings",
            component: () => import("../views/secretHitler/rankings/Index.vue"),
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

export function setupRouter() {
  const locale = i18n.global.locale.value;

  // create router instance
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  // navigation guards
  router.beforeEach(async (to, from, next) => {
    const paramsLocale = to.params.locale as Languages;
    const roles = to.meta.roles as role[] | null;

    if (to.meta.requiresAuth && !auth.isAuthorized(roles))
      next({ path: "/en/login" });

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

    overlay.hide();

    return next();
  });

  return router;
}
