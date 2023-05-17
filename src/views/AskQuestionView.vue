<template>
  <v-container grid-list-xs>
    <ask-question-component :askTo="askTo"></ask-question-component>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import AskQuestionComponent from "@/components/Question/AskQuestionComponent.vue";

@Component({
  components: {
    AskQuestionComponent,
  },
})
export default class AskQuestionView extends Vue {
  askTo: string | null = null;

  mounted() {
    if (this.$route.query.to) {
      this.askTo = this.$route.query.to as string;
    }
  }
}
</script>
