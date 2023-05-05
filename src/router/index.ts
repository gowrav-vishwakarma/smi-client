import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import HomeView from "../views/HomeView.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/RegisterView.vue"),
  },

  {
    // path: "/verification/:username/authtoken", // replace to second one becuase authtoken may contain /
    path: "/verification/:username/*",
    name: "verification",
    component: () => import("../views/VerificationView.vue"),
  },
  {
    path: "/forget",
    name: "forget",
    component: () => import("../views/ForgetPassword.vue"),
  },
  {
    path: "/resetpassword/:username/*",
    name: "resetpassword",
    component: () => import("../views/ResetPasswordView.vue"),
  },

  {
    path: "/question/:id",
    name: "question",
    component: () => import("../views/QuestionDetailView.vue"),
  },
  {
    path: "/ask-question",
    name: "ask-question",
    component: () => import("../views/AskQuestionView.vue"),
  },
  {
    path: "/my-profile",
    name: "my-profile",
    component: () => import("../views/MyProfileView.vue"),
  },
  {
    path: "/profile/:userId",
    name: "profile/:userId",
    component: () => import("../views/publicProfile.vue"),
  },
  {
    path: "/solution-attempt/:solutionId",
    name: "solution-attempt",
    component: () => import("../views/SolutionAttempt.vue"),
  },
  {
    path: "/updatepassword",
    name: "updatepassword",
    component: () => import("../components/User/UpdatePassword.vue"),
  },

  {
    path: "/docslayout",
    name: "docslayout",
    component: () => import("../views/LayoutDocs.vue"),
    // component: () => import("../views/LayoutThree.vue"),
  },

  {
    path: "*",
    name: "not-found",
    component: () => import("../views/NotFound.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
