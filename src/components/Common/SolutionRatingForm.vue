<template lang="pug">
div.text-center.solution-rating-form-component
    v-card(class="mx-auto" flat max-width="400px" )
        v-card-title(style="align-items:center;") {{title}}
        v-card-text Please take a few seconds to rate your experience. It really helps!
          v-rating( v-model="rating" color="yellow darken-3" background-color="grey darken-1" active-color="yellow-accent-4" hover size="48" length="5")
          v-textarea(label="comment" v-model="comment" outline prepend-icon="mdi-comment" rows="4")
          v-checkbox(v-if="isQuestioner" label="Mark Solved" v-model="markSolved")
        v-divider
        v-card-actions
          v-btn(color="primary"  block @click="submitRating") Submit Solution & Rating Now
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import QuestionListResponseDTO from "@/dto/response/question-list-response.dto";
import SolutionAttemptDetailResponseDTO from "@/dto/response/solutionattempt-detail-response.dto";
import solutionsApi from "@/services/solutions.api";
import { eventBus } from "@/mixins/event-bus";
import { AuthStoreModule } from "@/store";
import userApi from "@/services/user.api";

@Component({
  name: "SolutionRatingForm",
  components: {},
})
export default class SolutionRatingForm extends Vue {
  @Prop({ default: null })
  readonly question!: QuestionListResponseDTO;

  @Prop({ default: false })
  readonly isMyQuestion!: boolean;

  @Prop({ default: null })
  readonly solutionAttemptDetail!: SolutionAttemptDetailResponseDTO;

  @Prop({ default: null })
  recordingData: any;

  @Prop({ default: null })
  recordingText!: string;

  rating = 0;
  comment = "";
  markSolved = false;
  progress = 0;

  get title() {
    if (this.isOfferer) {
      return "Rating For Questioner";
    } else return "Rating For Solver";
  }

  get isOfferer() {
    return (
      this.$route.params.solutionId == this.solutionAttemptDetail._id &&
      this.solutionAttemptDetail.offererId ==
        this.$store.getters.loggedInUser._id
    );
  }

  get isQuestioner() {
    return (
      this.$route.params.solutionId == this.solutionAttemptDetail._id &&
      this.solutionAttemptDetail.questionerId ==
        this.$store.getters.loggedInUser._id
    );
  }

  async submitRating() {
    eventBus.$emit("show-loader");

    await solutionsApi.createSolutionRating(
      {
        solutionAttemptId: this.$route.params.solutionId,
        comment: this.comment,
        rating: this.rating,
        forOfferer: !this.isOfferer,
        forQuestioner: !this.isQuestioner,
        offererId: this.solutionAttemptDetail.offererId,
        questionId: this.solutionAttemptDetail.questionId,
        questionerId: this.solutionAttemptDetail.questionerId,
        markedSolved: this.markSolved,
        // solutionAttemptDetail: this.solutionAttemptDetail,

        videoText: this.recordingText,
      },
      this.recordingData,
      (event) => {
        this.progress = Math.round((100 * event.loaded) / event.total);
      }
    );

    // todo save video here

    eventBus.$emit("hide-loader");
    userApi.setOnlineStatus("ONLINE");
    await AuthStoreModule.updateUserOnlineStatusAction("ONLINE");

    this.$router.push("/question/" + this.solutionAttemptDetail.questionId);
  }

  mounted() {
    console.log(this.solutionAttemptDetail, "inside rating form");
  }
}
</script>
