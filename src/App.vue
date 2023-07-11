<template lang="pug">
  v-app
    ui-app-bar
    v-main(class="grey lighten-3")
      SMILoader(v-if="isLoading")
      router-view
      v-footer.mt-5.pa-5.text-center(padless elevation="5" )
        v-row(style="width:100%;")
          v-col(cols="12" sm="12" lg="6")
            b [smi]
            | &nbsp; Solve My Issue
          v-col(cols="12" sm="12" lg="6")
            router-link.ml-5(to="/" class="redirect-link") Home
            router-link.ml-5(to="/about" class="redirect-link") About
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
