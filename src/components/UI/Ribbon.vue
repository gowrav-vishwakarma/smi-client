<template lang="pug">
  .ribbon-container
      .ribbon.green.darken-2.text-center {{headingLabel}}
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  name: "Ribbon",
  components: {},
})
export default class Ribbon extends Vue {
  @Prop({ default: "Ribbon" })
  readonly headingLabel!: string;
}
</script>

<style>
.ribbon-container {
  position: absolute;
  display: inline-block;
  z-index: 1;
}
.ribbon {
  position: absolute;
  top: 0;
  left: -80px;
  color: #ffffff;
  //font-weight: bold;
  transform: rotate(315deg);
  z-index: 1;
  width: 180px;
  text-align: center;
}
</style>
