<template lang="pug">
  .signature.assolver
    .d-flex.justify-space-between
      v-card.solver-avatar-card(flat tile)
        v-list.pa-0
          v-list-item.pa-0.pl-1
            v-avatar(color="primary" size="40" v-if="!disableAvatar")
              user-avatar(:user="User")
            //-     v-img(alt="Q DP" src="@/assets/logo.png" transition="scale-transition" to="/")
            v-list-item-content.ml-1.pa-0(v-if="!disableName")
              v-list-item-title.ma-0 {{User.name}}
                //- span.ml-4.primary--text(v-if="!disableFollow") . Follow
              v-list-item-subtitle
                small {{User.description}}
      User-Rating-AsSolver(:User="User" v-if="enableRating")
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import UserAvatar from "@/components/User/Avatar.vue";
import UserRatingAsSolver from "@/components/User/RatingAsSolver.vue";

@Component({
  name: "UserSignatureAsSolver",
  components: {
    UserAvatar,
    UserRatingAsSolver,
  },
})
export default class UserSignatureAsSolver extends Vue {
  @Prop({ default: null, required: true }) User: any;

  @Prop({ default: false }) disableAvatar!: false;

  @Prop({ default: false }) disableName!: false;
  @Prop({ default: false }) enableRating!: false;
  @Prop({ default: false }) disableFollow!: false;

  // reputation = 0;
}
</script>
