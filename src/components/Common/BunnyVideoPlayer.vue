<template lang="pug">
    div(style="position:relative;padding-top:56.25%;")
      iframe(:src="bunnyEmbedSourceURL" loading="lazy" style="border:none;position:absolute;top:0;height:100%;width:100%;" allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;" allowfullscreen="true")
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  name: "BunnyVideoPlayer",
  components: {},
})
export default class BunnyVideoPlayer extends Vue {
  @Prop({ default: null })
  readonly videoPath!: string;

  get bunnyEmbedSourceURL() {
    return (
      "https://iframe.mediadelivery.net/embed/" +
      this.videoPath +
      "?autoplay=false&loop=false&muted=false&preload=false"
    );
  }
}
</script>
