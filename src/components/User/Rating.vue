<template lang="pug">
.d-flex
        span.ml-1.primary--text(style="font-size:1em")  {{reputation}}
        v-icon(small color="yellow darken-2") mdi-star
        small (By {{User.reputationAsQuestioner.totalRatingsCount}} user)
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import ByUser from "@/dto/byUser.dto";

@Component({
  name: "UserRating",
})
export default class ByUserComponent extends Vue {
  @Prop({ default: null, required: true }) User!: ByUser;

  get reputation(): number {
    // const accpectedRatio =
    //   this.User.reputationAsQuestioner.totalMarkedSolved /
    //   this.User.reputationAsQuestioner.totalQuestionsAsked;
    // const accpectedRatioFixed = isNaN(accpectedRatio) ? 0 : accpectedRatio;
    const rating = Math.round(
      ((this.User.reputationAsQuestioner.totalRatingsSum /
        this.User.reputationAsQuestioner.totalRatingsCount) *
        10) /
        10
    );

    return isNaN(rating) ? 0 : rating;
    // const ratingFixed = isNaN(rating) ? 0 : rating;
    // return `Accpeted ${accpectedRatioFixed}% out of ${this.User.reputationAsQuestioner.totalQuestionsAsked} with ${ratingFixed} star rating`;
  }

  mounted() {
    // console.log("this.User inside rating", this.User);
  }
}
</script>
