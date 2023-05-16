<template lang="pug">
.signature.assolver
  .d-flex.justify-space-between
    v-card.solver-avatar-card(flat tile)
      v-list.pa-0
        v-list-item.pa-0.pl-1
          v-badge(v-if="displayOnlineLayout" bordered bottom :color="solverOnlineStatus?'green lighten-1':'red lighten-1'" dot offset-x="10" offset-y="10")
            v-avatar( size="40" v-if="!disableAvatar" style="border:4px solid;" :color="solverOnlineStatus?'green lighten-1':'red'")
              user-avatar(:user="User")
          div(v-else)
            v-avatar( size="40" v-if="!disableAvatar" style="border:2px solid;")
              user-avatar(:user="User")
          //-     v-img(alt="Q DP" src="@/assets/logo.png" transition="scale-transition" to="/")
          v-list-item-content.ml-1.pa-0(v-if="!disableName")
            v-list-item-title.blue--text.lighten-3(@click="redirectToProfile" style="cursor:pointer").ma-0 {{User.name}}
              //- span.ml-4.primary--text(v-if="!disableFollow") . Follow
            v-list-item-subtitle
              small {{User.post}}
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

  @Prop({ default: false }) solverOnlineStatus!: false;
  @Prop({ default: false }) displayOnlineLayout!: false;

  @Prop({ default: false }) disableName!: false;
  @Prop({ default: false }) enableRating!: false;
  @Prop({ default: false }) disableFollow!: false;

  // reputation = 0;

  redirectToProfile() {
    window.open("/profile/" + this.User._id, "_blank");
  }
}
</script>
