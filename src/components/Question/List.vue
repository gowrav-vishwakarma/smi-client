<template lang="pug">
div(style="width: 100%")
  div(style="width: 100%" v-if="questions && questions.length > 0")
    question-single(v-for="(question, i) in questions" :question="question" :key="questions[i]._id")
    //- AuthDialog(:showDialog="showAuthDialog")
  v-card(style="width: 100%" v-else-if="questions && questions.length == 0")
    v-card-title.primary--text No Questions Found, Try removing filters
  v-card(style="width: 100%" v-else)
    v-card-title.primary--text Loading...
  v-layout.pt-2(style="border-top: 1px solid")
    v-flex(xs12)
      v-btn.primary(@click="prevPage" :disabled="!hasPrevPage" :class="{disabled: !hasPrevPage,active: hasPrevPage}" :style="{'margin-right': '10px'}") Previous
      v-btn.primary(@click="nextPage" :disabled="!hasNextPage" :class="{disabled: !hasNextPage,active: hasNextPage}" :style="{'margin-left': '10px'}") Next
  v-btn.orange.hidden-sm-and-up(dark fixed fab class="transition-swing v-btn v-btn--bottom v-btn--is-elevated v-btn--fab v-btn--fixed v-btn--round theme--light orange" aria-label="Scroll to top" title="Scroll to top" style="z-index: 6; margin-bottom: 0px; transform-origin: center center;" to="/ask-question")
      v-icon mdi-plus
</template>

<script lang="ts">
import "reflect-metadata";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { FilterQuestionsDTO } from "../../dto/request/question-filter.dto";
import QuestionListResponseDTO from "@/dto/response/question-list-response.dto";
import QuestionSingle from "@/components/Question/Single.vue";
import QuestionApiService from "@/services/questions.api";
// import AuthDialog from "@/components/User/AuthDialog.vue";
import { eventBus } from "@/mixins/event-bus";

@Component({
  name: "QuestionList",
  components: {
    QuestionSingle,
    // AuthDialog,
  },
})
export default class QuestionList extends Vue {
  questions: QuestionListResponseDTO[] | null = null;
  hasPrevPage = false;
  hasNextPage = false;
  currentPage = 1;
  questionsPerPage = 20;
  @Prop({ default: () => ({}) }) readonly filter!: FilterQuestionsDTO;

  async mounted() {
    this.getQList({
      ...this.$store.getters.filters,
      page: this.currentPage,
      limit: this.questionsPerPage,
    });
  }

  @Watch("$store.getters.filters", { immediate: true })
  async getQList(filterData: any) {
    let filterQuery = this.filter;
    if (filterData != undefined) {
      filterQuery = filterData;
    }

    this.questions = await QuestionApiService.getQuestions(filterQuery);
    this.hasNextPage = this.questions.length === this.questionsPerPage;
    this.hasPrevPage = this.currentPage > 1;
  }

  authDialogCallback(value: any) {
    console.log("callback function", value);
  }

  nextPage() {
    this.currentPage++;
    this.getQList({ page: this.currentPage, limit: this.questionsPerPage });
  }

  prevPage() {
    this.currentPage--;
    this.getQList({ page: this.currentPage, limit: this.questionsPerPage });
  }
}
</script>
