<template lang="pug">
  .ribbon-container.green.darken-2.text-center.gradient-bg
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
  border-radius: 0 10px 10px 0;
}

.gradient-bg {
  background: linear-gradient(45deg, #4caf50, #2e7d32);
  animation: changeRibbonColor 1s infinite alternate;
}

@keyframes changeRibbonColor {
  0% {
    background: linear-gradient(135deg, #00ff00, #2e7d32);
  }
  100% {
    background: linear-gradient(135deg, #00aa00, #ff9800);
  }
}
</style>
