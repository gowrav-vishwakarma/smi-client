<template lang="pug">
    v-card.solver-rating-card.pa-1.rounded-lg( flat )
        v-list.pa-0
            v-list-item.pa-0
                v-icon(large color="yellow darken-2") mdi-star
                v-list-item-content.ml-1.pa-0(style="display:block;")
                    v-list-item-title.ma-0 
                        small Rating - {{reputation}}
                        span.ml-1.primary--text(style="font-size:1em") 
                    v-list-item-subtitle 
                        small By {{User.ratingAsSolver.totalRatingCount}} user
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import ByUser from "@/dto/byUser.dto";

@Component({
  name: "UserRatingAsSolver",
})
export default class ByUserComponent extends Vue {
  @Prop({ default: null, required: true }) User!: ByUser;

  get reputation(): number {
    // const totalSolutionsAttempted =
    //   this.User.ratingAsSolver.totalOfferingCount +
    //   this.User.ratingAsSolver.totalCommentsCount;
    // const accpectedRatio =
    //   this.User.ratingAsSolver.totalAcceptedCount / totalSolutionsAttempted;
    // const accpectedRatioFixed = isNaN(accpectedRatio) ? 0 : accpectedRatio;
    const rating = Math.round(
      ((this.User.ratingAsSolver.totalRatingSum /
        this.User.ratingAsSolver.totalRatingCount) *
        10) /
        10
    );
    const ratingFixed = isNaN(rating) ? 0 : rating;
    // return `(${ratingFixed}) ${accpectedRatioFixed}% accepted of ${totalSolutionsAttempted}`;
    return ratingFixed;
  }

  mounted() {
    // console.log("this.User inside rating as solver", this.User);
  }
}
</script>
