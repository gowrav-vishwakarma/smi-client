<template>
  <div class="d-flex">
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn text small v-bind="attrs" v-on="on" class="pa-0">
          <ws-manager></ws-manager>
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
          <v-list-item-title class="text-center green--text">
            Online
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          style="min-height: 28px"
          @click="updateOnlineStatus('Offline')"
        >
          <v-list-item-title class="text-center red--text">
            Offline
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          style="min-height: 28px"
          @click="updateOnlineStatus('Busy')"
        >
          <v-list-item-title class="text-center orange--text">
            Busy
          </v-list-item-title>
        </v-list-item>
        <v-list-item class="pa-0">
          <v-btn
            text
            plain
            to="/my-profile"
            v-if="$store.getters.isAuthenticated"
            pa-0
          >
            <v-icon> mdi-account</v-icon>
            Profile
          </v-btn>
        </v-list-item>
        <v-list-item class="pa-0">
          <v-btn
            text
            plain
            @click="logout"
            v-if="$store.getters.isAuthenticated"
            pa-0
            color="red"
          >
            <v-icon> mdi-logout</v-icon>
            logout
          </v-btn>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import WsManager from "@/components/User/TopMenu/WSManager.vue";
import { AuthStoreModule } from "@/store";

@Component({
  name: "LoggedInUserTopMenu",
  components: {
    WsManager,
  },
})
export default class LoggedInUserTopMenu extends Vue {
  async logout() {
    await AuthStoreModule.resetCurrentUserAction();
    this.$router.push("/");
  }

  updateOnlineStatus(status: string) {
    AuthStoreModule.updateUserOnlineStatusAction(status);
  }
}
</script>
