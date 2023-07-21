<template lang="pug">
    div(style="position:relative;padding-top:56.25%;")
      iframe(:src="bunnyEmbedSourceURL" ref="iframe" loading="lazy" style="border:none;position:absolute;top:0;height:100%;width:100%;" allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;" allowfullscreen="true" v-intersect="onIntersect" )
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

  onIntersect(entries, observer) {
    // More information about these options
    // is located here: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    if (!entries[0].isIntersecting) {
      console.log(
        "Video is not visible anymore, pausing it.",
        this.$refs.iframe
      );
      if (this.$refs.iframe) {
        const video: HTMLVideoElement = (
          this.$refs.iframe as any
        ).contentWindow.postMessage('{"method":"pause"}', "*");
        if (video) {
          console.log("Video found");
          video.pause();
        } else console.log("Video not found");
      }
    }
  }
}
</script>
