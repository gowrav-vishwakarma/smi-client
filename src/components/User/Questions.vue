<template lang="pug">
div(style="width: 100%")
  v-checkbox(v-model="showOnlyOpen" label="Show Only Open Questions")
  div(v-if="questions.length>0")
    question-single(v-for="(question, i) in questions" :question="question" :key="question._id" :isMyProfileView="true" @questionClosed="onQuestionClosed")
  v-card(v-else)
    v-card-text You have not asked any questions yet, Start asking questions
</template>

<script lang="ts">
import QuestionListResponseDTO from "@/dto/response/question-list-response.dto";
import userApi from "@/services/user.api";
import { Component, Vue, Watch } from "vue-property-decorator";
import QuestionSingle from "@/components/Question/Single.vue";

@Component({
  name: "UserQuestions",
  components: {
    QuestionSingle,
  },
})
export default class UserQuestionsComponent extends Vue {
  questions: QuestionListResponseDTO[] = [];
  showOnlyOpen = true;

  @Watch("showOnlyOpen")
  async onShowOnlyOpenChanged() {
    this.questions = await userApi.getMyQuestions(this.showOnlyOpen);
  }

  onQuestionClosed(questionId: string) {
    this.questions = this.questions.filter((q) => q._id !== questionId);
  }

  async mounted() {
    this.questions = await userApi.getMyQuestions(this.showOnlyOpen);
    console.log(this.questions);
  }
}
</script>
