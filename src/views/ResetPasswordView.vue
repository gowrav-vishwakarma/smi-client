<template lang="pug">
  v-container.text-center
    v-card(v-if="validate")
      UpdatePasswordComponent
    div(v-else)
      P Validating, Please wait...
      v-progress-linear(color="deep-orange accent-4" indeterminate rounded height="6")
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { AuthStoreModule } from "@/store";
import UserAPIService from "../services/user.api";
import { CurrentUserI } from "@/store/module/auth";
import UpdatePasswordComponent from "@/components/User/UpdatePassword.vue";

@Component({
  name: "ResetPasswordValidatorView",
  components: {
    UpdatePasswordComponent,
  },
})
export default class ResetPasswordView extends Vue {
  validate = false;

  async mounted() {
    console.log(this.$route.params);
    // call user api and validate token and redirect to setting page

    const data = await UserAPIService.loginWithToken({
      username: this.$route.params.username,
      token: this.$route.params.pathMatch,
    }).catch((err: any) => {
      // this.wrongCredential = true;
      if (err.response?.status === 401) {
        console.log("Username or password is incorrect");
      } else {
        console.log(err);
      }
    });
    if (data) {
      let user: CurrentUserI = {
        ...data.user,
        accessToken: data.accessToken,
      };
      await AuthStoreModule.setCurrentUserAction(user);
      this.validate = true;
      // this.$store.commit("updateFilters", filter);
      // this.$router.push("/my-profile");
    }
  }
}
</script>
