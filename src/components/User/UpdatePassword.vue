<template lang="pug">
    v-container(v-if="isAuthenticated")
      v-row
        v-col(cols="12" sm="12" xs="12" lg="8" md="8")
          v-container
            h3.mb-5 Reset your password
            v-form(ref="changePasswordForm" v-model="valid" lazy-validation)
              v-text-field(v-model="new_password" outlined label="New Password" :type="showPassword ? 'text' : 'password'" :rules="passwordRules" required :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showPassword = !showPassword")
              v-text-field(v-model="confirm_password" outlined label="Confirm Password" type="password" :rules="[v => v === new_password || 'Passwords must match']" required)
              div.pa-3
                small Password strength
                v-progress-linear(:value="passwordStrength" :color="passwordStrengthColor" height="5")
              v-btn.mt-5(:disabled="!formValid" color="primary"  @click="submitForm") Update Password
        v-col(cols="12" sm="12" xs="12" lg="4" md="4")
          v-card
            v-card-title Password Hints
            v-card-text
              ul
                li Password must be at least 8 characters
                li Password must contain at least one uppercase letter
                li Password must contain at least one lowercase letter
                li Password must contain at least one digit / number
</template>

<script lang="ts">
import { Component, Vue, Ref } from "vue-property-decorator";
import userApi from "@/services/user.api";
import { eventBus } from "@/mixins/event-bus";
import { AuthStoreModule } from "@/store";

@Component({
  name: "UpdatePassword",
})
export default class UpdatePasswordComponent extends Vue {
  @Ref("changePasswordForm") private changePasswordForm!: HTMLFormElement;

  new_password = "";
  confirm_password = "";
  valid = false;
  showPassword = false;

  get formValid() {
    return (
      this.new_password.length > 0 &&
      this.confirm_password.length > 0 &&
      this.new_password === this.confirm_password
    );
  }

  passwordRules = [
    (v: string) => !!v || "Password is required",
    (v: string) =>
      (v && v.length >= 8) || "Password must be at least 8 characters",
    (v: string) =>
      /[A-Z]/.test(v) || "Password must contain at least one uppercase letter",
    (v: string) =>
      /[a-z]/.test(v) || "Password must contain at least one lowercase letter",
    (v: string) =>
      /[0-9]/.test(v) || "Password must contain at least one digit",
    (v: string) =>
      /[!@#$%^&*(),.?":{}|<>]/.test(v) ||
      "Password must contain at least one special character",
  ];

  get passwordStrength(): number {
    const score = this.getPasswordStrengthScore();
    return score * 25;
  }

  get passwordStrengthColor(): string {
    const score = this.getPasswordStrengthScore();
    if (score === 0) {
      return "error";
    } else if (score === 1) {
      return "warning";
    } else if (score === 2) {
      return "info";
    } else {
      return "success";
    }
  }
  getPasswordStrengthScore(): number {
    let score = 0;
    if (this.new_password.length >= 8) {
      score++;
    }
    if (/[A-Z]/.test(this.new_password)) {
      score++;
    }
    if (/[a-z]/.test(this.new_password)) {
      score++;
    }
    if (/[0-9]/.test(this.new_password)) {
      score++;
    }
    if (/[!@#$%^&*(),.?":{}|<>]/.test(this.new_password)) {
      score++;
    }
    return score;
  }

  get isAuthenticated() {
    return this.$store.getters.isAuthenticated;
  }

  async submitForm(): Promise<any> {
    eventBus.$emit("show-loader");
    let xyz = await userApi.updateProfile(
      {
        userId: this.$store.getters.loggedInUser._id,
        password: this.confirm_password,
      },
      null,
      null
    );
    eventBus.$emit("hide-loader");
    await AuthStoreModule.resetCurrentUserAction();
    this.$router.push("/login");
  }

  validateForm(): void {
    this.valid = this.changePasswordForm.validate();
  }

  mounted() {
    // this.validateForm();
    this.formValid;
  }
}
</script>
