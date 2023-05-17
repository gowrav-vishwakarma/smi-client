<template lang="pug">
v-card.mb-2.pa-5.question-single-card(v-if="question")
  v-card.pa-0.ma-0.question-detail-card(flat)
    .d-flex.justify-space-between
      h4.text-subtitle-1.question-heading.primary--text( style="cursor:pointer" @click="gotoDetails") Q. {{question.title}}
      .d-flex.justify-end
        v-icon(v-if="question.scope=='Public'" color="green" @click.stop="isMyProfileView && changeScope('Private')") mdi-earth
        v-icon(v-if="question.scope=='Private'" color="red" @click.stop="isMyProfileView && changeScope('Public')") mdi-lock
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
    question-value-component(:question="question")
    voting-component.pr-3(v-if="!disableVotingAction" :question="question")
      //- booking-component(v-if="!disableBookmarkAction" :question="question")
      //- share-button(v-if="!disableShareAction" :question="question")
    solution-channels-component(v-if="question.solutionChannels" :solutionChannels="question.solutionChannels")
      v-menu(bottom left v-if="isMyProfileView")
        template(v-slot:activator='{ on, attrs }')
          v-btn( x-small color="primary" v-bind='attrs' v-on='on')
            | {{question.status}}
            v-icon(x-small) mdi-dots-vertical
        v-list
          v-list-item(v-if="question.status!=='OPEN'" @click="changeStatus('OPEN')")
            v-list-item-title.caption Open
          v-list-item(v-if="question.status!=='CLOSED'" @click="changeStatus('CLOSED')")
            v-list-item-title.caption Closed
          v-list-item(v-if="question.status!=='SOLVED'" @click="changeStatus('SOLVED')")
            v-list-item-title.caption Solved

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

  changeScope(scope: "Private" | "Public") {
    QuestionsAPIService.changeScope(this.question._id, scope).then((res) => {
      this.question.scope = scope;
    });
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

  changeStatus(status: "OPEN" | "CLOSED" | "SOLVED") {
    const confirm = window.confirm(
      "Are you sure you want to change status of this question?"
    );
    if (!confirm) return;
    QuestionsAPIService.changeStatus(this.question._id, status);
    this.question.status = status;
    this.$emit("questionStatusChanged", this.question._id, status);
  }
}
</script>
