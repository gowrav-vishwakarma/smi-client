<template>
  <div class="d-flex">
    <ws-manager :hideWSIcon="true"></ws-manager>
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          text
          small
          v-bind="attrs"
          v-on="on"
          class="pa-0 ma-0"
          style="min-width: auto !important"
        >
          <span class="hidden-sm-and-down">{{
            $store.getters.loggedInUser.name
          }}</span>
          <v-badge
            bordered
            :color="onlineColor"
            offset-x="15"
            offset-y="15"
            v-bind="attrs"
            v-on="on"
            class="pa-0 ma-0"
            :content="unreadOffers"
            left
          >
            <v-avatar size="40" style="border: 4px solid" :color="onlineColor">
              <user-avatar :user="loggedInUser"></user-avatar>
            </v-avatar>
          </v-badge>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          style="min-height: 28px"
          @click="updateOnlineStatus('ONLINE')"
        >
          <v-list-item-title class="green--text">
            <v-icon small color="green"> mdi-circle</v-icon>
            Online
          </v-list-item-title>
        </v-list-item>

        <v-list-item to="/unread-offers" style="min-height: 28px">
          <v-list-item-title>
            <v-icon small>mdi-message-outline </v-icon>
            UnRead Offers
            <v-chip
              color="red"
              text-color="white"
              x-small
              class="pa-2"
              v-if="unreadOffers > 0"
              >{{ unreadOffers }}
            </v-chip>
          </v-list-item-title>
        </v-list-item>
        <v-list-item to="/my-profile" style="min-height: 28px">
          <v-list-item-title>
            <v-icon small> mdi-account</v-icon>
            Profile
          </v-list-item-title>
        </v-list-item>
        <v-list-item to="/ask-question" style="min-height: 28px">
          <v-list-item-title>
            <v-icon small color="orange darken-2"> mdi-plus</v-icon>
            ASk Question
          </v-list-item-title>
        </v-list-item>
        <v-list-item @click="logout" style="min-height: 28px">
          <v-list-item-title>
            <v-icon small> mdi-logout</v-icon>
            logout
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import WsManager from "@/components/User/TopMenu/WSManager.vue";
import { AuthStoreModule } from "@/store";
import userApi from "@/services/user.api";
import UserAvatar from "@/components/User/Avatar.vue";

@Component({
  name: "LoggedInUserTopMenu",
  components: {
    WsManager,
    UserAvatar,
  },
})
export default class LoggedInUserTopMenu extends Vue {
  unreadOffers = 0;

  mounted() {
    userApi.getUnreadOffers(true, false).then((res) => {
      this.unreadOffers = res;
      // console.log("unread offers", res);
    });
  }

  async logout() {
    await AuthStoreModule.resetCurrentUserAction();
    this.$router.push("/");
  }

  updateOnlineStatus(status: "ONLINE" | "OFFLINE" | "BUSY") {
    AuthStoreModule.updateUserOnlineStatusAction(status);
  }

  get onlineColor() {
    return this.$store.getters.userOnlineStatus == "BUSY"
      ? "orange darken-3"
      : this.$store.getters.userOnlineStatus == "ONLINE"
      ? "green lighten-1"
      : "red lighten-1";
  }

  get loggedInUser() {
    return {
      name: this.$store.getters.loggedInUser.name,
      email: this.$store.getters.loggedInUser.email,
      profileImage: this.$store.getters.loggedInUser.profileImage,
    };
  }
}
</script>
