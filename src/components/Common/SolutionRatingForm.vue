<template lang="pug">
  div.text-center.solution-rating-form-component
      v-card(class="mx-auto elevation-16" max-width="400" )
          v-card-title(style="align-items:center;") {{title}}
          v-card-text Please take a few seconds to rate your experience. It really helps!
            v-rating( v-model="rating" color="yellow darken-3" background-color="grey darken-1" active-color="yellow-accent-4" hover size="48" length="5")
            v-textarea(label="comment" v-model="comment" outline prepend-icon="mdi-comment" rows="2")
          v-divider
          v-card-actions
            v-btn(color="primary" text block @click="submitRating") Rate Now
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import QuestionListResponseDTO from "@/dto/response/question-list-response.dto";
import SolutionAttemptDetailResponseDTO from "@/dto/response/solutionattempt-detail-response.dto";
import solutionsApi from "@/services/solutions.api";
import { eventBus } from "@/mixins/event-bus";

@Component({
  name: "SolutionRatingForm",
  components: {},
})
export default class SolutionRatingForm extends Vue {
  @Prop({ default: null })
  readonly question!: QuestionListResponseDTO;

  @Prop({ default: null })
  readonly solutionAttemptDetail!: SolutionAttemptDetailResponseDTO;

  rating = 0;
  comment = "";

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
    await solutionsApi.createSolutionRating({
      solutionAttemptId: this.$route.params.solutionId,
      comment: this.comment,
      rating: this.rating,
      forOfferer: !this.isOfferer,
      forQuestioner: !this.isQuestioner,
      offererId: this.solutionAttemptDetail.offererId,
      questionId: this.solutionAttemptDetail.questionId,
      questionerId: this.solutionAttemptDetail.questionerId,
      // solutionAttemptDetail: this.solutionAttemptDetail,
    });

    eventBus.$emit("hide-loader");

    this.$router.push("/question/" + this.solutionAttemptDetail.questionId);
  }

  mounted() {
    console.log(this.solutionAttemptDetail, "inside rating form");
  }
}
</script>
