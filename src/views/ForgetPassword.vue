<template lang="pug">
  v-container.text-center.mt-4(style="max-width: 500px")
    h3.text-h5.pa-3 Reset Your Password
    div.mt-6
      v-form(ref="resetPasswordForm" v-model="valid" lazy-validation)
        v-text-field(v-model="emailId" :rules="emailRules" placeholder="Your Registered Email Id" label="your registered email id" outlined required class="field" @input="wrongCredential = false")
        v-btn.lgnbtn.mt-4.mb-4(@click="sendLink" block color="orange " dark :loading="loading" :disabled="!emailId || !valid" rounded) Get, Password Reset Link
      div(v-if="wrongCredential")
        v-alert(type="error")  your email id is not registered with us
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import UserAPIService from "../services/user.api";

@Component({
  components: {},
})
export default class ForgetPasswordView extends Vue {
  private emailId: string | null = null;
  valid = false;
  loading = false;
  wrongCredential = false;

  private emailRules = [
    (v: any) =>
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
      "E-mail must be valid",
  ];

  async sendLink() {
    this.loading = true;
    if (!this.valid || !this.emailId) return;

    await UserAPIService.sendResetPasswordLink(this.emailId)
      .then((res) => {
        this.loading = false;
        console.log("reset password link response", res);
      })
      .catch((err: any) => {
        this.loading = false;
        this.wrongCredential = true;
        this.valid = false;
        console.log(err);
      });
  }
}
</script>
