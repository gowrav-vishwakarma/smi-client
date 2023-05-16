<template>
  <v-container style="width: 100%; max-width: 100%">
    <v-card>
      <v-card-title class="d-flex justify-space-between mb-2">
        <div>Offers list on your Questions</div>
        <div>
          <v-switch
            v-model="showReadOffers"
            label="Show read offers"
          ></v-switch>
        </div>
      </v-card-title>
    </v-card>
    <v-card v-if="unreadOffers.length == 0">
      <v-card-title class="d-flex justify-center">
        <div>No {{ showReadOffers ? "Read" : "UnRead" }} Offers</div>
      </v-card-title>
    </v-card>
    <div v-else>
      <v-card v-for="offer of unreadOffers" :key="offer._id">
        <v-card-title
          style="cursor: pointer"
          class="blue--text"
          @click="gotoDetails(offer.questionId._id)"
        >
          Q: {{ offer.questionId.title }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="d-flex justify-space-between">
          <div>By: {{ offer.offererId.name }}</div>
          <div>
            <v-btn
              x-small
              color="success"
              @click="markRead(offer._id, !offer.isRead)"
              >Mark {{ offer.isRead ? "UnRead" : "Read" }}</v-btn
            >
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script lang="ts">
import QuestionList from "@/components/Question/List.vue";
import TopicList from "@/components/Topic/List.vue";
import userApi from "@/services/user.api";
import { Component, Vue, Watch } from "vue-property-decorator";
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
  showReadOffers = false;

  @Watch("showReadOffers")
  onShowReadOffersChanged() {
    userApi.getUnreadOffers(false, this.showReadOffers).then((res) => {
      this.unreadOffers = res;
    });
  }

  markRead(offerId: string, readStatus: boolean) {
    userApi.markOfferRead(offerId, readStatus).then((res) => {
      this.unreadOffers = this.unreadOffers.filter((o) => o._id != offerId);
    });
  }

  mounted() {
    userApi.getUnreadOffers(false, this.showReadOffers).then((res) => {
      this.unreadOffers = res;
    });
  }

  gotoDetails(questionId: string) {
    this.$router.push("/question/" + questionId);
  }
}
</script>
