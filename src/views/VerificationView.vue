<template lang="pug">
    v-container.text-center.mt-4(style="max-width: 500px")
        v-card.pa-4
            div.text-subtitle-1 Verifying your email account
            div.text-h5 {{this.$route.params.username}}
            v-card-text
                v-progress-linear(v-if="loader" color="orange" indeterminate rounded height="10")
                div(v-else)
                  div(v-if="verified")
                    v-alert(type="success") your account has been verified
                    v-btn(color="orange" to="/login") click to Login
                    v-progress-circular(indeterminate color="primary")
                  div(v-else="verified")
                    v-alert(type="error") verification link expired
                    v-btn(color="orange" @click="resendLink") resend verification link
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import UserAPIService from "../services/user.api";

@Component({
  name: "VerificationView",
  components: {},
})
export default class VerificationView extends Vue {
  loader = true;
  verified = false;

  async mounted() {
    if (this.$route.params != undefined) {
      await UserAPIService.verifyUser({
        username: this.$route.params.username,
        authtoken: this.$route.params.authtoken,
      })
        .then((res: any) => {
          this.loader = false;
          this.verified = true;

          setTimeout(() => {
            this.$router.push("/login"); // Replace '/new-page' with the URL you want to redirect to
          }, 2 * 1000);
        })
        .catch((err: any) => {
          this.loader = false;

          if (err.response?.status === 401) {
            console.log("verification link expired");
          } else {
            console.log(err);
          }
        });
    }
  }

  resendLink() {
    console.log("todo resend verification link");
    UserAPIService.sendVerificationLink(this.$route.params.username);
  }
}
</script>
