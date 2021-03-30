import { auth } from "@/services/auth.service";
import { overlay } from "@/services/overlay.service";
import { currentLanguage } from "@/services/language.service";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { SUPPORT_LOCALES, setI18nLanguage, loadLocaleMessages } from "./i18n";

const routes: RouteRecordRaw[] = [
  {
    path: "",
    redirect: {
      name: "trumpHistory",
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
        path: "trump",
        name: "trump",
        component: () => import("../views/trump/Index.vue"),
        meta: { requiresAuth: true },
        children: [
          {
            path: "new",
            name: "trumpNew",
            component: () => import("../views/trump/New.vue"),
          },
          {
            path: "edit/:id",
            name: "trumpEdit",
            component: () => import("../views/trump/Edit.vue"),
          },
          {
            path: "history",
            name: "trumpHistory",
            component: () => import("../views/trump/History.vue"),
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
        ],
      },
      {
        path: "secretHitler",
        name: "secretHitler",
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

    if (to.meta.requiresAuth && !auth.isAuthorized())
      next({ path: "/it/login" });

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
