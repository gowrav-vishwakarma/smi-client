const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: ["vuetify"],
  pwa: {
    iconPaths: {
      faviconSVG: "img/icons/favicon-32x32.png",
      favicon32: "img/icons/favicon-32x32.png",
      favicon16: "img/icons/favicon-16x16.png",
      appleTouchIcon: "img/icons/apple-touch-icon-152x152.png",
      maskIcon: "img/icons/favicon-32x32.png",
      msTileImage: "img/icons/msapplication-icon-144x144.png",
    },
  },
});
