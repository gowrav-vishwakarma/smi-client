<template lang="pug">
    v-container.text-center.mt-4(style="max-width: 500px")
        v-card.pa-4
            div.text-subtitle-1 Verifying your email account
            div.text-h5 {{this.$route.params.username}}
            v-card-text
                v-progress-linear(color="orange" indeterminate rounded height="10")
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
  async mounted() {
    if (
      this.$route?.params != undefined ||
      this.$route?.params?.username != undefined ||
      this.$route?.params?.authToken != undefined
    ) {
      await UserAPIService.verifyUser({
        username: this.$route.params.username,
        password: this.$route.params.authToken,
      }).catch((err: any) => {
        if (err.response?.status === 401) {
          console.log("Username or password is incorrect");
        } else {
          console.log(err);
        }
      });
    }
  }
}
</script>
