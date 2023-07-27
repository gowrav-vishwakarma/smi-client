<template lang="pug">
  .ribbon-container.text-right
      span.pr-3.ribbon Asked:
        |  {{headingLabel}}
        v-icon(x-small) mdi-clock
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  name: "FlatRibbon",
  components: {},
})
export default class FlatRibbon extends Vue {
  @Prop({ default: "Ribbon" })
  readonly headingLabel!: string;
}
</script>

<style scoped>
.ribbon {
  font-size: 10px;
}

.ribbon-container {
  position: absolute;
  display: inline-block;
  right: 0;
}
</style>
