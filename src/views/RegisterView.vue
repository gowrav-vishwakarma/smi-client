<template>
  <v-container class="text-center mt-4" style="max-width: 600px">
    <v-card elevation="2" class="pa-4">
      <v-alert
        class="default-offer-container"
        dark
        icon="mdi-ticket-percent-outline"
        border="left"
        prominent
      >
        Register Now to Enjoy unrestricted access to all premium features of our
        platform, giving you the full experience without any restrictions.
      </v-alert>
      <register-component></register-component>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import RegisterComponent from "@/components/User/RegisterComp.vue";

@Component({
  name: "LoginView",
  components: {
    RegisterComponent,
  },
})
export default class RegisterView extends Vue {}
</script>

<style scoped>
@keyframes offerBgColor {
  0% {
    background: #fb8c00;
  }
  20% {
    background: #33cc36;
  }
  40% {
    background: #b8cc33;
  }
  60% {
    background: #fcca00;
  }
  80% {
    background: #33cc36;
  }
  100% {
    background: #33cccc;
  }
}
.default-offer-container {
  background: #33cccc; /* Fallback */
  animation: offerBgColor 9s infinite linear;
  text-align: center;
  padding: 2em;
}
</style>
