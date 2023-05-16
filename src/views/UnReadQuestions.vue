<template>
  <v-container style="width: 100%; max-width: 100%">
    <v-row>
      <v-col>
        <v-card v-for="offer of unreadOffers" :key="offer._id">
          <v-card-title
            style="cursor: pointer"
            class="blue--text"
            @click="gotoDetails(offer.questionId._id)"
          >
            Q: {{ offer.questionId.title }}
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>By: {{ offer.offererId.name }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import QuestionList from "@/components/Question/List.vue";
import TopicList from "@/components/Topic/List.vue";
import userApi from "@/services/user.api";
import { Component, Vue } from "vue-property-decorator";
import goTo from "vuetify/lib/services/goto";

@Component({
  name: "UnReadQuestions",
  components: {
    QuestionList,
    TopicList,
  },
})
export default class HomeView extends Vue {
  unreadOffers: any[] = [];

  mounted() {
    userApi.getUnreadOffers(false).then((res) => {
      this.unreadOffers = res;
    });
  }

  gotoDetails(questionId: string) {
    this.$router.push("/question/" + questionId);
  }
}
</script>
