<template lang="pug">
  v-app
    ui-app-bar
    v-main(class="grey lighten-3")
      SMILoader(v-if="isLoading")
      router-view
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import UiAppBar from "@/components/UI/AppBar.vue";
import { eventBus } from "@/mixins/event-bus";
import SMILoader from "@/components/Common/Loader.vue";

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
  }
}
</script>
