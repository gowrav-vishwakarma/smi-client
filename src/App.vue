<template lang="pug">
  v-app
    ui-app-bar
    v-main(class="grey lighten-3")
      SMILoader(v-if="isLoading")
      router-view
    v-footer.mt-5(padless dark)
      v-flex.text-center
        v-card-text
          b [smi]
          | &nbsp; Solve My Issue
        v-card(flat tile)
          router-link(to="/about" class="redirect-link") About
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import UiAppBar from "@/components/UI/AppBar.vue";
import { eventBus } from "@/mixins/event-bus";
import SMILoader from "@/components/Common/Loader.vue";
import smartlookClient from "smartlook-client";

@Component({
  components: {
    UiAppBar,
    SMILoader,
  },
})
export default class App extends Vue {
  isLoading = false;

  created() {
    console.log("App created");
  }

  mounted() {
    eventBus.$on("show-loader", () => {
      this.isLoading = true;
    });
    eventBus.$on("hide-loader", () => {
      this.isLoading = false;
    });

    if (process.env.VUE_APP_SMARTLOOKKEY) {
      console.log("Setting smartlook");
      smartlookClient.init(process.env.VUE_APP_SMARTLOOKKEY);
      if (this.$store.getters.isAuthenticated) {
        smartlookClient.identify(this.$store.getters.loggedInUser.email, {
          name: this.$store.getters.loggedInUser.name,
        });
      }
    } else {
      console.log("Skipping smartlook in staging");
    }

    // setting meta data title of page
    document.title = "Solve My Issue";
  }
}
</script>
