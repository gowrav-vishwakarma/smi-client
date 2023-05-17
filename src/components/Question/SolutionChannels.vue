<template lang="pug">
.d-flex.flex-column
  div(v-if="solutionChannels")
      v-icon(small class="icon " color="green" v-if="solutionChannels.audioCall") mdi-phone-incoming
      v-icon(small class="icon " color="red" v-else) mdi-phone-incoming
      v-icon(small class="icon " color="green" v-if="solutionChannels.chat") mdi-chat
      v-icon(small class="icon " color="red" v-else) mdi-chat
      v-icon(small v-if="solutionChannels.screenShare" color="green" class="") mdi-monitor
      v-icon(small v-else color="red" class="") mdi-monitor-off
      v-icon(small color="green" class="" v-if="solutionChannels.videoCall") mdi-video
      v-icon(small color="red" class="" v-else) mdi-video-off
  slot
</template>

<script lang="ts">
import "reflect-metadata";
import SolutionChannelsDTO from "@/dto/solution-channels.dto";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  name: "SolutionChannelsComponent",
})
export default class SolutionChannelsComponent extends Vue {
  @Prop({ default: null })
  readonly solutionChannels!: SolutionChannelsDTO | null;
}
</script>
