<template lang="pug">
v-container.grid-list-xs
  v-row.no-gutter
    //- offer section
    v-col.col-md-4.col-sm-4.col-xs-4
      div.hidden-sm-and-down(style="position:sticky;top:70px;")
        create-offer-component(:question="question" v-if="!isQuestionBelongsToLoginUser" :isSolved="isSolved")
        v-card(v-else)
          v-card-title(:class="{green: isSolved}") {{isSolved? "SOLVED": "Your Question: Offers List"}}
        question-offer-list.mt-3(:question="question" :isSolved="question.status == 'SOLVED'")
      v-expansion-panels.hidden-md-and-up
        v-expansion-panel
          v-expansion-panel-header(:class="{green: isSolved}")
            div(v-if="!isQuestionBelongsToLoginUser") Offer Solution
            div(v-else) {{isSolved? "SOLVED": "Your Question: Offers List"}}
          v-expansion-panel-content
            create-offer-component(:showTitle="false" :question="question" v-if="!isQuestionBelongsToLoginUser" :isSolved="isSolved")
            question-offer-list.mt-3(:question="question" :isSolved="isSolved" )
    //- question section
    v-col.col-md-8.col-sm-8.col-xs-8
      question-single(:question="question" :key="question._id" disableAnswerSection="true" showDetail="true" videoControl="true" :isMyQuestion="isQuestionBelongsToLoginUser")
      v-subheader Comments
      question-comments-list-component(:question="question" @event-new-comment-created="reloadData")
      //- .ml-1
      //-   .text-h6 {{ question.title }}
      //-   .caption.mt-2 {{ question.detail }}
        //- solution-channels-component.ml-auto(v-if="question.solutionChannels" :solutionChannels="question.solutionChannels")
        //- user-signature-as-questioner(:User="question.byUser")
        //- .d-flex
          question-value-component(:question="question")
          .caption.ml-auto.grey--text.lighten-4 asked {{ humanized_time_span(question.createdAt) }}
        //- voting-component(:question="question")
</template>

<script lang="ts">
import QuestionDetailResponseDTO from "@/dto/response/question-detail-response.dto";
import { Component, Mixins, Prop, Vue } from "vue-property-decorator";
import { VueEditor } from "vue2-editor";
import CreateOfferComponent from "@/components/Offer/CreateOfferComponent.vue";
import QuestionOfferList from "@/components/Offer/List.vue";
import SolutionChannelsComponent from "@/components/Question/SolutionChannels.vue";
import QuestionValueComponent from "@/components/Question/QuestionValueComponent.vue";
import QuestionCommentsListComponent from "@/components/Comments/List.vue";
import UserSignatureAsQuestioner from "@/components/User/Signature/AsQuestioner.vue";
import VotingComponent from "@/components/Common/VotingComponent.vue";
import { General } from "@/mixins/general";
import QuestionSingle from "@/components/Question/Single.vue";

@Component({
  name: "QuestionDetailComponent",
  components: {
    VueEditor,
    CreateOfferComponent,
    QuestionOfferList,
    SolutionChannelsComponent,
    QuestionValueComponent,
    QuestionCommentsListComponent,
    UserSignatureAsQuestioner,
    VotingComponent,
    QuestionSingle,
  },
})
export default class QuestionDetailComponent extends Mixins(General) {
  @Prop({ required: true }) readonly question!: QuestionDetailResponseDTO;

  get isQuestionBelongsToLoginUser(): boolean {
    return this.$store.getters.loggedInUser &&
      this.$store.getters.loggedInUser._id
      ? this.question.byUser._id == this.$store.getters.loggedInUser._id
      : false;
  }

  get isSolved() {
    return this.question.status == "SOLVED";
  }

  reloadData() {
    console.log("event catch from child component");
    this.question.questionValue.totalCommentsCount += 1;
  }
}
</script>
