<template lang="pug">
div(style="width: 100%" v-if="renderOfferList")
  single-offer(v-for="offer in questionOffers" :offer="offer" :key="offer._id" :question="question" :isSolved="isSolved" :solverOnlineStatusList="solverOnlineStatusList")
</template>

<script lang="ts">
import "reflect-metadata";
import { Component, Prop, Vue } from "vue-property-decorator";
import QuestionDetailResponseDTO from "@/dto/response/question-detail-response.dto";
import SingleOffer from "@/components/Offer/SingleOfferComponent.vue";
import questionsApi from "@/services/questions.api";
import { SocketOn, SocketEmit } from "@/services/socket";

@Component({
  name: "QuestionOfferList",
  components: {
    SingleOffer,
  },
})
export default class QuestionOfferListComponent extends Vue {
  @Prop({ default: null }) readonly question!: QuestionDetailResponseDTO;

  @Prop({ default: false }) readonly isSolved!: boolean;

  questionOffers: any[] = [];
  connectedUserPayloadReceived = false;
  solverOnlineStatusList: string[] = [];

  get renderOfferList() {
    return this.question && this.connectedUserPayloadReceived;
  }

  async mounted() {
    /**
     * payload: {
          questionId: payload.questionId,
          onlineUserIds: onlineUser,
        }
     */

    SocketOn("checkedUserConnected", (payload) => {
      if (payload.questionId == this.question._id) {
        console.log("checkedUserConnected", payload);
        this.solverOnlineStatusList = payload.onlineUserIds;
        this.connectedUserPayloadReceived = true;
      }
    });

    await questionsApi.getOffers(this.question._id).then((offers) => {
      let offererIds = offers.map((a: any) => a.offererId);
      offererIds.push(this.question.questionerId);

      if (offererIds.length) {
        this.connectedUserPayloadReceived = false;
        this.solverOnlineStatusList = [];

        SocketEmit("checkUserConnected", {
          userId: offererIds,
          questionId: this.question._id,
        });
        // console.log("checkUserConnected", offererIds);
      }
      // checkUserConnected
      this.questionOffers = offers;
    });
  }
}
</script>
