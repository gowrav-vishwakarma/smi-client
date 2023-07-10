<template lang="pug">
v-card.mb-2.question-single-card(v-if="question" style="overflow:hidden;")
  Ribbon(headingLabel="Solved" v-if='question.status=="SOLVED"')
  v-card.pa-0.ma-0.question-detail-card(flat)
    //- .d-flex.justify-space-between
    //-   h4.text-subtitle-1.question-heading.primary--text( style="cursor:pointer" @click="gotoDetails") Q. {{question.title}}
    .d-flex.justify-space-between
      v-card-title.question-heading(style="cursor:pointer" @click="gotoDetails") Q. {{question.title}}
      //.d-flex.justify-end
      //  v-icon(v-if="question.scope=='Public'" color="green" @click.stop="isMyProfileView && changeScope('Private')") mdi-earth
      //  v-icon(v-if="question.scope=='Private'" color="red" @click.stop="isMyProfileView && changeScope('Public')") mdi-lock
      //  v-icon(x-large color="red" size="100" v-if="!displayVideo" :disabled="!question.video || question.video ==''") mdi-youtube
    .question-description-text
      v-card-subtitle.pt-0.text--secondary.text-justify.smi-question-detail(v-if="showDetail" v-html="question.detail")
      v-row(no-gutters v-else)
        v-col(v-if="videoURL && question.video" cols="12" md="7" sm="12" xs="12" lg="7" xl="7" )
          v-card-subtitle.pt-0.pb-0.text--secondary.text-justify {{shortdetail}}
        v-col(v-else cols="12")
          v-card-subtitle.pt-0.pd-0.text--secondary.text-justify {{shortdetail}}
        v-col(v-if="videoURL && question.video" cols="12" md="5" sm="12" xs="12" lg="5" xl="5")
          v-card-subtitle.pt-0.pb-0.text--secondary.text-justify
            video.smi-video-player-component(width="100%" controls="true" preload="none")
              source(:src="videoURL" type="video/webm")
      v-card.question-description-image(color="primary lighten-3" flat v-if="question.image")
          v-img(src="@/assets/logo.png" max-height="350" contain)
      v-card.mt-2.d-flex.justify-center.question-description-video(flat v-if="question.video && displayVideo")
          video(width="320" height="240" :controls="videoControl" preload="none")
            source(:src="videoURL" type="video/webm")
  .d-flex.pa-3
    .d-flex.flex-column.justify-space-between
      .caption.grey--text.lighten-4 Asked {{ humanized_time_span(question.createdAt) }} :
      questioner-signature(:User="question.byUser")
    .d-flex.flex-column.ml-auto
      .caption.primary--text.lighten-4.ml-auto {{convertTotag(question.tags)}}
      .caption.primary--text.lighten-4.ml-auto.hidden-sm-and-down {{topicFull}}
      .caption.primary--text.lighten-4.ml-auto.hidden-md-and-up {{lastTopic}}
  v-divider
  .d-flex.pa-3(style="align-items:center")
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
          v-list-item(color="red" @click="deleteQuestion")
            v-list-item-title.caption Delete

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
import Ribbon from "@/components/UI/Ribbon.vue";
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
    Ribbon,
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

  @Prop({ default: false }) showDetail!: boolean;

  gotoDetails() {
    this.$router.push("/question/" + this.question._id).catch((err) => {
      if (err.name !== "NavigationDuplicated") {
        throw err;
      }
    });
  }

  get isMyQuestion() {
    if (AuthStoreModule.loggedInUser == null) return false;
    return AuthStoreModule.loggedInUser._id === this.question.byUser._id;
  }

  get displayVideo() {
    return this.videoControl;
  }

  get videoURL() {
    return process.env.VUE_APP_S3_CDN_URL + this.question.video;
  }

  get shortdetail() {
    return S(this.question.detail).stripTags().truncate(200).s;
  }

  get topicFull() {
    const maxCharLen = 30;
    const topics = this.question.topic;

    if (topics.length === 1) {
      // Return the only topic if there is only one
      return topics[0];
    } else if (topics.length > 1) {
      let topicString = topics[0];
      let remainingLength = maxCharLen - topicString.length;

      for (let i = 1; i < topics.length; i++) {
        const topic = topics[i];
        const topicLength = topic.length;

        if (topicLength <= remainingLength) {
          // Append the topic if it fits within the remaining length
          topicString += ` / ${topic}`;
          remainingLength -= topicLength + 3; // Account for ' / ' separator
        } else {
          // Break the loop if the remaining length is not enough for the next topic
          break;
        }
      }

      if (topicString.length < maxCharLen) {
        // Append ellipsis (...) if the full topic string is shorter than the maximum length
        topicString += " ...";
      }

      if (topics.length > 2) {
        // Add the last topic if there are more than two topics
        topicString += ` / ${topics[topics.length - 1]}`;
      }

      return topicString;
    }

    return "";
  }

  get lastTopic() {
    return this.question.topic[this.question.topic.length - 1];
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

  deleteQuestion() {
    const confirm = window.confirm(
      "Are you sure you want to delete this question?"
    );
    if (!confirm) return;
    QuestionsAPIService.deleteQuestion(this.question._id);
    this.$emit("questionDeleted", this.question._id);
  }
}
</script>

<style>
.question-heading:hover {
  color: var(--v-primary-base); /* Replace with the desired color variable */
  cursor: pointer; /* Add a cursor style on hover, if desired */
}

.smi-question-detail p {
  margin-bottom: 0 !important;
}

.smi-video-player-component {
  box-shadow: 0px 5px 1px -2px rgba(255, 152, 0, 0.1),
    0px 2px 5px 0px rgba(255, 152, 0, 0.1),
    0px 1px 5px 0px rgba(255, 152, 0, 0.1);
}
</style>
