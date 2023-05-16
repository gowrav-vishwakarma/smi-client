<template lang="pug">
div(style="width: 100%") 
  div(v-if="offers.length > 0" style="width: 100%")
    v-card.d-flex.flex-column.mb-2.pa-2(v-for="(offer,i) in offers" :key="i")
      h4.blue--text(@click="gotoDetails(offer.questionId._id)" style="cursor:pointer") Q: {{offer.questionId.title}}
      .caption( v-html="offer.questionId.detail")
      p.mt-3
      .caption <b>Your Note:</b> {{ offer.notes }}
      span.mt-2
      .caption.grey--text.lighten-4 asked {{ humanized_time_span(offer.createdAt) }}
      .d-flex.justify-space-between
        questioner-signature(:User="offer.questionerId")
        v-btn.white--text(small color="red" @click="removeOffer(offer._id)") Delete
  v-card(v-else) 
    v-card-text You have not made any offers yet, Start helping others

    
</template>

<script lang="ts">
import QuestionerSignature from "@/components/User/Signature/AsQuestioner.vue";
import { Component, Mixins } from "vue-property-decorator";
import { General } from "@/mixins/general";
import userApi from "@/services/user.api";
import solutionApi from "@/services/solutions.api";

@Component({
  name: "UserOffers",
  components: {
    QuestionerSignature,
  },
})
export default class UserOffersComponent extends Mixins(General) {
  offers: any[] = [];

  gotoDetails(questionId: string) {
    this.$router.push("question/" + questionId);
  }

  removeOffer(offerId: string) {
    const confirmed = confirm("Are you sure you want to delete this offer?");
    if (confirmed) {
      solutionApi.removeSolutionOffer(offerId);
      this.offers = this.offers.filter((offer) => offer._id !== offerId);
    }
  }

  async mounted() {
    this.offers = await userApi.getMyOffers();
    console.log("this.offers", this.offers);
  }
}
</script>
