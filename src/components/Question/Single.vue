<template lang="pug">
v-card.mb-2.pa-5.question-single-card(v-if="question")
  v-card.pa-0.ma-0.question-detail-card(flat @click="gotoDetails")
    .d-flex.justify-space-between
      h4.text-subtitle-1.question-heading.primary--text( style="cursor:pointer") Q. {{question.title}}
      .d-flex.justify-end
        v-icon(v-if="question.scope=='Public'" color="green") mdi-earth
        v-icon(v-if="question.scope=='Private'" color="red") mdi-lock
        v-icon(x-large color="red" size="100" v-if="!displayVideo" :disabled="!question.video || question.video ==''") mdi-youtube
    .question-description-text
      .text-body-2.text--secondary.text-justify.question-description-text.ml-5 {{shortdetail}}
      v-card.question-description-image(color="primary lighten-3" flat v-if="question.image")
          v-img(src="@/assets/logo.png" max-height="350" contain)
      v-card.mt-2.d-flex.justify-center.question-description-video(flat v-if="question.video && displayVideo")
          video(width="320" height="240" :controls="videoControl" preload="none")
            source(:src="question.video" type="video/webm")
  .d-flex.mt-3
    .caption.grey--text.lighten-4 Asked {{ humanized_time_span(question.createdAt) }} :
    .caption.primary--text.lighten-4.ml-auto {{convertTotag(question.tags)}}
  questioner-signature(:User="question.byUser")
  v-divider
  .d-flex.mt-1(style="align-items:center")
    div
      question-value-component(:question="question")
      .d-flex
        voting-component(v-if="!disableVotingAction" :question="question")
        //- booking-component(v-if="!disableBookmarkAction" :question="question")
        //- share-button(v-if="!disableShareAction" :question="question")
    .ml-auto(v-if="!disableAnswerSection")
      .d-flex
        solution-channels-component(v-if="question.solutionChannels" :solutionChannels="question.solutionChannels")
        v-btn(v-if="isMyProfileView && isMyQuestion && question.status=='OPEN'" :color="question.status=='OPEN'?'red':'green'" small @click="closeQuestion") Close
        v-btn.primary(v-if="!disableAnswerBtn" rounded small @click="gotoDetails") Answer
</template>

<script lang="ts">
import "reflect-metadata";
import S from "string";
import { Component, Prop, Mixins } from "vue-property-decorator";
import QuestionListResponseDTO from "@/dto/response/question-list-response.dto";
import { General } from "@/mixins/general";
import SolutionChannelsComponent from "@/components/Question/SolutionChannels.vue";
import QuestionerSignature from "@/components/User/Signature/AsQuestioner.vue";
import QuestionValueComponent from "@/components/Question/QuestionValueComponent.vue";
import VotingComponent from "@/components/Common/VotingComponent.vue";
import BookingComponent from "@/components/Common/BookmarkComponent.vue";
import ShareButton from "@/components/Common/ShareButton.vue";
import { AuthStoreModule } from "@/store";

import QuestionsAPIService from "@/services/questions.api";

// import DataService from "@/services/DataService";

@Component({
  name: "QuestionSingle",
  components: {
    SolutionChannelsComponent,
    QuestionerSignature,
    QuestionValueComponent,
    VotingComponent,
    BookingComponent,
    ShareButton,
  },
})
export default class QuestionSingle extends Mixins(General) {
  @Prop({ default: null })
  readonly question!: QuestionListResponseDTO;

  @Prop({ default: false })
  isMyProfileView!: boolean;

  @Prop({ default: true }) disableAnswerBtn: any;

  @Prop({ default: false }) disableAnswerSection: any;

  @Prop({ default: false }) disableShareAction: any;

  @Prop({ default: false }) disableBookmarkAction: any;

  @Prop({ default: false }) disableVotingAction: any;

  @Prop({ default: false }) videoControl!: boolean;

  gotoDetails() {
    this.$router.push("/question/" + this.question._id);
  }

  get isMyQuestion() {
    if (AuthStoreModule.loggedInUser == null) return false;
    return AuthStoreModule.loggedInUser._id === this.question.byUser._id;
  }

  get displayVideo() {
    return this.videoControl;
  }

  get shortdetail() {
    return S(this.question.detail).stripTags().truncate(100).s;
  }

  convertTotag(inArr: [string]) {
    return inArr.length > 0
      ? inArr
          .map((i: string) => {
            return "#" + i;
          })
          .join(" ")
      : "";
  }

  closeQuestion() {
    const confirm = window.confirm(
      "Are you sure you want to close this question?"
    );
    if (!confirm) return;
    QuestionsAPIService.closeQuestion(this.question._id);
    this.$emit("questionClosed", this.question._id);
  }
}
</script>
