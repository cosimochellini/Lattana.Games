// Inside vue.config.js
module.exports = {
  // ...other vue-cli plugin options...
  pwa: {
    name: "Lattana Games",
    themeColor: "#60A5FA",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
    },
    // configure the workbox plugin
    workboxPluginMode: "GenerateSW",
  },
};
