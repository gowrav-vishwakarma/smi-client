<template lang="pug">
    v-row.no-gutters
      v-col.caption(cols=12 sm=4) {{ question.questionValue.totalVoteCount + question.questionValue.totalVoteDownCount }} Votes
      v-col.caption(cols=12 sm=4) {{ question.questionValue.totalCommentsCount }} Comments
      v-col.caption(cols=12 sm=4) {{ question.questionValue.totalOfferingCount }} Offers
</template>

<script lang="ts">
import "reflect-metadata";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  name: "QuestionValueComponent",
})
export default class QuestionValue extends Vue {
  @Prop({ default: null })
  readonly question!: any;
}
</script>
