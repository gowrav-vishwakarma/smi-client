<template lang="pug">
div.question-answer-list.mt-2.pa-2
  //.d-flex.answer-list-section
    //div.flex-shrink-0
      //- v-avatar.mt-1(color="primary" size="40")
      //-   v-icon mdi-account
      //solver-signature(:User="comment.User" disableName="true")
    //div.pa-1
    //div( style="overflow:auto;")
  v-card.answer-card
    .d-flex
      solver-signature(:User="comment.User")
      div.ml-auto()
        v-card-subtitle
          small.text--disabled {{ humanized_time_span(comment.createdAt) }}
    v-card-text
      div.custom-html(v-html="comment.comment")
      //v-icon(x-large color="red" size="100" v-if="!displayVideo && comment.video" @click="displayVideo=true") mdi-youtube
      div(v-if="comment.video")
        //v-card.mt-2.d-flex.justify-center.question-description-video(flat v-if="comment.video")
          //video(width="100%" height="240" preload="none" controls)
          //  source(:src="videoURL" type="video/webm")
        BunnyVideoPlayer(:videoPath="comment.video")
    v-card-actions
      v-icon(v-if="comment.isQuestionSolved" color="green" ) mdi-check-all
      voting-component(:comment="comment")
        //- div(class="caption")
        //-   span(v-html="comment.comment")
        //-     span.caption.ml-auto.grey--text.lighten-4
        //-       {{humanized_time_span(comment.createdAt)}}
        //-   voting-component():comment="comment")
</template>

<script lang="ts">
import "reflect-metadata";
import { Component, Mixins, Prop } from "vue-property-decorator";
import SolverSignature from "@/components/User/Signature/AsSolver.vue";
import VotingComponent from "@/components/Common/VotingComponent.vue";
import BunnyVideoPlayer from "@/components/Common/BunnyVideoPlayer.vue";
import Ribbon from "@/components/UI/Ribbon.vue";
import { General } from "@/mixins/general";

@Component({
  name: "SingleCommentComponent",
  components: {
    SolverSignature,
    VotingComponent,
    Ribbon,
    BunnyVideoPlayer,
  },
})
export default class SingleCommentComponent extends Mixins(General) {
  @Prop({ default: null, required: true })
  readonly comment!: any;

  displayVideo = false;
  get videoURL() {
    return process.env.VUE_APP_S3_CDN_URL + this.comment.video;
  }
}
</script>

<style>
.custom-html p {
  all: unset;
  margin-bottom: 0px !important;
}
</style>
