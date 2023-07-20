<template lang="pug">
  .ribbon-container.green.darken-2.text-center
      .ribbon {{headingLabel}}
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

<style scoped>
.ribbon {
  //position: absolute;
  //width: 100px;
  //left: -60px;
  font-size: 10px;
  //text-align: center;
  //padding: 1px;
}

.ribbon-container {
  z-index: 1;
  //transform: rotate(315deg);
  position: absolute;
  display: inline-block;
  //top: 10px;
  color: #ffffff;
  //left: -35px;
  //width: 100px;
  width: 50px;
}
</style>
