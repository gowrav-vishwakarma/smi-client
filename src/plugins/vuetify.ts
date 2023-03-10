import Vue from "vue";
import Vuetify from "vuetify/lib";
import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdi", // || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
  },
  theme: {
    options: {
      customProperties: true,
    },
    // themes: {
    // light: {
    //   primary: colors.grey.darken2, // #E53935
    //   secondary: colors.red.lighten4, // #FFCDD2
    //   accent: colors.indigo.base, // #3F51B5
    // },
    // },
    // themes: {
    // light: {
    //   primary: "#007BFF",
    //   secondary: "#424242",
    //   accent: "#82B1FF",
    //   error: "#FF5252",
    //   info: "#2196F3",
    //   success: "#4CAF50",
    //   warning: "#FFC107",
    // },
    // },
  },
});
