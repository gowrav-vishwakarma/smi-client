<template lang="pug">
  v-dialog(v-model="isLoading" hide-overlay persistent width="300")
    v-card(color="orange" dark)
      v-card-text loading please wait ...
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
}
</script>
