declare module "vue-i18n/dist/vue-i18n.esm-bundler";
declare module "@/vuedraggable";

declare module "@/configuration/bottomBar" {
  const items: import("./shared").BottomElement[];
  export default items;
}

declare module "@/configuration/navbar" {
  const ex: {
    states: import("./").Dictionary<
      import("./shared").ApplicationState
    >;
    navbarRoutes: { name: string; route: string }[];
    profileRoutes: { name: string; route: string }[];
  };

  export default ex;
}
