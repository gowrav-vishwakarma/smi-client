<template lang="pug">
    v-container.text-center.mt-4(style="max-width: 500px")
      v-card.pa-4
          div.text-subtitle-1 Verifying your account
          div.text-h5 {{this.$route.params.username}}
          v-card-text(v-if="verificationViaOTP")
            v-alert Enter your Verification Code
            v-otp-input(length="6" v-model="verificationotp" @finish="verifyotp")
            v-overlay(absolute :value="loader")
              v-progress-circular(indeterminate color="primary")
            v-divider.mt-10
            p OR
            p If you not receive otp
            v-btn(color="orange" @click="resendLink") resend verification code
          v-card-text(v-else)
              v-progress-linear(v-if="loader" color="orange" indeterminate rounded height="10")
              div(v-else)
                div(v-if="verified")
                  v-alert(type="success") your account has been verified
                  v-btn(color="orange" to="/login") click to Login
                  v-progress-circular(indeterminate color="primary")
                div(v-else="verified")
                  v-alert(type="error") verification link expired
                  v-btn(color="orange" @click="resendLink") resend verification link
      v-snackbar(v-model="snackbar" :color="snackbarColor" :timeout="snackbarTimeout" centered	) {{snackbarMessage}}
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import UserAPIService from "../services/user.api";

@Component({
  name: "VerificationView",
  components: {},
})
export default class VerificationView extends Vue {
  loader = false;
  verified = false;
  verificationViaOTP = false;
  verificationotp = "";
  snackbar = false;
  snackbarColor = "success";
  snackbarMessage = "youe email id verified successfully";
  snackbarTimeout = "1000";

  async mounted() {
    // console.log(this.$route.params.username, );

    if (this.$route.params.pathMatch == "verifycode") {
      this.verificationViaOTP = true;
    }

    if (
      this.$route.params != undefined &&
      this.$route.params.pathMatch != "verifycode"
    ) {
      await UserAPIService.verifyUser({
        username: this.$route.params.username,
        authtoken: this.$route.params.pathMatch,
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

  async resendLink() {
    // console.log(" resend verification link");
    if (this.$route.params.username) {
      await UserAPIService.sendVerificationLink(this.$route.params.username);
      this.snackbarColor = "success";
      this.snackbarMessage =
        "verification code send to your registered email id" +
        this.$route.params.username;
      this.snackbar = true;
      this.snackbarTimeout = "3000";
    } else {
      alert("your email id is not defined");
    }
  }

  async verifyotp() {
    console.log("verify otp", this.verificationotp);
    this.loader = true;

    await UserAPIService.verifyUserOTP({
      username: this.$route.params.username,
      code: this.verificationotp,
    })
      .then((res: any) => {
        this.loader = false;
        this.verified = true;
        this.verificationotp = "";
        this.snackbar = true;
        this.snackbarColor = "success";
        this.snackbarMessage = "youe email id verified successfully";

        setTimeout(() => {
          this.$router.push("/login");
        }, 1 * 1000);
      })
      .catch((err: any) => {
        this.loader = false;
        this.verificationotp = "";
        this.snackbar = true;
        this.snackbarColor = "red";
        this.snackbarMessage = err.response.data.message;
      });
  }
}
</script>
