import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueToastify from "vue-toastify";
import { io, Socket } from "socket.io-client";

const URL = process.env.VUE_APP_WS_URL || "https://solvemyissue.online";
const socket: Socket = io(URL, { autoConnect: false });
Vue.prototype.$socket = socket;

Vue.use(VueToastify);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,

  render: (h) => h(App),
}).$mount("#app");
