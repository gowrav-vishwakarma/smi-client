<template>
  <div class="d-flex">
    <ws-manager></ws-manager>
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn text small v-bind="attrs" v-on="on" class="pa-0">
          <span class="hidden-sm-and-down">
            {{ $store.getters.loggedInUser.name }}
            <v-icon>mdi-dots-vertical</v-icon>
          </span>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          style="min-height: 28px"
          @click="updateOnlineStatus('Online')"
        >
          <v-list-item-title class="green--text">
            <v-icon small color="green"> mdi-circle</v-icon>
            Online
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          style="min-height: 28px"
          @click="updateOnlineStatus('Offline')"
        >
          <v-list-item-title class="red--text">
            <v-icon small color="red"> mdi-circle</v-icon>
            Offline
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          style="min-height: 28px"
          @click="updateOnlineStatus('Busy')"
        >
          <v-list-item-title class="orange--text">
            <v-icon small color="orange"> mdi-circle</v-icon>
            Busy
          </v-list-item-title>
        </v-list-item>
        <v-list-item to="/unread-offers" style="min-height: 28px">
          <v-list-item-title>
            UnRead Offers
            <v-chip color="red" x-small v-if="unreadOffers > 0"
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

@Component({
  name: "LoggedInUserTopMenu",
  components: {
    WsManager,
  },
})
export default class LoggedInUserTopMenu extends Vue {
  unreadOffers = 0;

  mounted() {
    userApi.getUnreadOffers(true, false).then((res) => {
      this.unreadOffers = res;
      console.log("unread offers", res);
    });
  }

  async logout() {
    await AuthStoreModule.resetCurrentUserAction();
    this.$router.push("/");
  }

  updateOnlineStatus(status: string) {
    AuthStoreModule.updateUserOnlineStatusAction(status);
  }
}
</script>
