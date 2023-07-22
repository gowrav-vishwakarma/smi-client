<template lang="pug">
  v-dialog(v-model="isLoading" hide-overlay persistent width="350")
    v-card(color="orange" dark)
      v-card-title {{title}}
      v-card-actions
        v-progress-linear(indeterminate color="white" class="mb-0" rounded height="10")
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  name: "SMILoader",
  components: {},
})
export default class SMILoader extends Vue {
  isLoading = true;

  @Prop()
  options: any;

  title = "Processing Please Wait ...";
  mounted() {
    if (this.options) {
      this.title = this.options.title;
    }
  }
}
</script>
