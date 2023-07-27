<template lang="pug">
div.signature.asquestioner
  //.d-flex.justify-left
  //  .caption.ml-0.blue--text(@click="viewProfile" style="cursor: pointer") {{User.name}}, {{User.post}}
  .d-flex.justify-space-between
    v-card.questioner-avatar-card(flat tile)
      v-list.pa-0
        v-list-item.pa-0
          v-avatar(color="primary" size="32px")
            user-avatar(:user="User")
              v-img(alt="Q DP" src="@/assets/logo.png" transition="scale-transition" to="/")
          v-list-item-content.ml-1.pa-0
            v-list-item-title.ma-0.blue--text(@click="viewProfile" style="cursor: pointer") {{User.name}}
              v-chip.ml-1.pa-1(v-if="User.post" x-small outlined) {{User.post}}
            v-list-item-title.ma-0
              User-Rating(:User="User")
              //span.ml-4.primary--text(style="cursor: pointer;" @click="viewProfile") view profile
                v-list-item-subtitle
                  small {{User.post}}
    //User-Rating(:User="User")
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import ByUser from "@/dto/byUser.dto";
import UserAvatar from "@/components/User/Avatar.vue";
import UserRating from "@/components/User/Rating.vue";

@Component({
  name: "ByUserComponent",
  components: {
    UserAvatar,
    UserRating,
  },
})
export default class ByUserComponent extends Vue {
  @Prop({ default: null, required: true }) User!: ByUser;

  // get reputation(): string {
  //   const accpectedRatio =
  //     this.User.reputationAsQuestioner.totalMarkedSolved /
  //     this.User.reputationAsQuestioner.totalQuestionsAsked;
  //   const accpectedRatioFixed = isNaN(accpectedRatio) ? 0 : accpectedRatio;
  //   const rating =
  //     this.User.reputationAsQuestioner.totalRatingsSum /
  //     this.User.reputationAsQuestioner.totalRatingsCount;
  //   const ratingFixed = isNaN(rating) ? 0 : rating;
  //   return `Accpeted ${accpectedRatioFixed}% out of ${this.User.reputationAsQuestioner.totalQuestionsAsked} with ${ratingFixed} star rating`;
  // }

  // mounted() {
  //   console.log("user ", this.User);
  // }

  viewProfile() {
    this.$router.push("/profile/" + this.User._id);
  }
}
</script>

<style>
/* .signature .questioner-avatar-card,
.signature .questioner-rating-card {
  cursor: pointer;
} */

.signature .questioner-rating-card .v-list-item {
  min-height: auto;
}

.signature .questioner-avatar-card .v-list-item__title,
.signature .questioner-rating-card .v-list-item__title {
  font-size: 0.8em;
}
</style>
