<template lang="pug">
v-app-bar(app='' color='white' flat='')
  router-link.d-flex.align-center(to="/" class="logo-link")
    v-toolbar-title(to='/')
      span.pt-1.pb-1(style="background-color: rgb(255, 152, 0) !important; border-radius: 15%; color: white; font-weight: 400;" ) [SMI]
      small.hidden-sm-and-down(class="ml-2") Solve My Issue
  v-spacer
  filter-component.flex-grow-1.mr-2
  v-spacer
  v-btn(rounded='' color='orange' v-if='!$store.getters.isAuthenticated' dark='' @click='askquestion')
    v-icon  mdi-plus 
    span.hidden-sm-and-down Ask Question
  v-btn(rounded='' color='orange' v-else='' dark='' to='/ask-question')
    v-icon  mdi-plus 
    span.hidden-sm-and-down Ask Question
  v-spacer
  top-menu
  auth-dialog(:show-dialog.sync='AuthDialogState')
  // selected filter options
  template(v-slot:extension='' v-if='isFilterSelected')
    v-container.d-flex.justify-space-between.grey.lighten-5.pa-0.mt-1(style='width: 100%; align-items: center')
      div(style='width: 100%')
        v-chip-group( style='width: 100%')
          v-chip(small color='red lighten-1 white--text' @click='clearFilter') {{ $store.getters.isCleared ? 'Default':'Clear' }}
          v-chip(small='' v-if='$store.getters.filters.query' close @click:close="clearQuery" @click="clearQuery")
            | {{ $store.getters.filters.query }}
          v-chip(small='' v-for='t in $store.getters.filters.languages' :key="'t' + t" close @click:close="clearLanguage(t)" @click="clearLanguage(t)")
            | {{ t }}
          v-chip(small v-if="$store.getters.filters.topics && $store.getters.filters.topics.length" v-for='t in $store.getters.filters.topics' :key="'topic' + t" close @click:close="clearTopic(t)" @click="clearTopic(t)" ) {{ t.split("/").reverse()[0] }}
          //- v-chip(small='' v-for='l in $store.getters.filters.languages' :key="'l' + l")
          //-   | {{ l }}
          v-chip(small v-if="$store.getters.filters.tags && $store.getters.filters.tags.length" v-for='t in $store.getters.filters.tags' :key="'tag' + t" close @click:close="clearTag(t)" @click="clearTag(t)") {{ t }} 
          //v-chip(small)
          //  v-icon(small class="icon mr-2" :color="$store.getters.filters.availableOnAudioCall? 'green':'red'") mdi-phone-incoming
          //  v-icon(small class="icon mr-2" :color="$store.getters.filters.availableOnChatChannel? 'green':'red'") mdi-chat
          //  v-icon(small class="icon mr-2" :color="$store.getters.filters.availableOnScreenShare?'green':'red'") mdi-monitor
          //  v-icon(small class="icon mr-2" :color="$store.getters.filters.availableOnVideoCall?'green':'red'") mdi-video
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TopMenu from "@/components/User/TopMenu/index.vue";
import AuthDialog from "@/components/User/AuthDialog.vue";
import FilterComponent from "@/components/Common/FilterComponent.vue";
import { eventBus } from "@/mixins/event-bus";
import { AuthStoreModule } from "@/store";
// import SolutionChannelsComponent from "@/components/Question/SolutionChannels.vue";

@Component({
  name: "AppBar",
  components: {
    TopMenu,
    AuthDialog,
    FilterComponent,
    // SolutionChannelsComponent,
  },
})
export default class App extends Vue {
  AuthDialogState = false;

  get isFilterSelected() {
    let found = 0;
    if (this.$store.getters.filters) {
      for (const a in this.$store.getters.filters) {
        if (
          this.$store.getters.filters[a] != null &&
          this.$store.getters.filters[a].length > 0
        ) {
          found += 1;
        }
      }
      found +=
        this.$store.getters.filters.availableOnAudioCall ||
        this.$store.getters.filters.availableOnVideoCall ||
        this.$store.getters.filters.availableOnScreenShare
          ? 1
          : 0;
      return found;
    }
    return found;
  }

  get solutionChannelFilter() {
    return {
      audioCall: this.$store.getters.filters.availableOnAudioCall,
      videoCall: this.$store.getters.filters.availableOnVideoCall,
      screenShare: this.$store.getters.filters.availableOnScreenShare,
    };
  }

  get solutionChannelFilterSelected() {
    return (
      this.$store.getters.filters.availableOnAudioCall ||
      this.$store.getters.filters.availableOnVideoCall ||
      this.$store.getters.filters.availableOnScreenShare
    );
  }

  askquestion() {
    if (!this.$store.getters.isAuthenticated) {
      this.$store.commit("setLoginSuccessRedirectUrl", this.$route.path);
      this.AuthDialogState = true;
      return;
    }
  }

  clearQuery() {
    this.$store.commit("setFilters", {
      ...this.$store.getters.filters,
      query: "",
    });
    eventBus.$emit("filterQuestions", {
      ...this.$store.getters.filters,
      query: "",
    });
  }

  clearLanguage(lang: string) {
    let languages = this.$store.getters.filters.languages;
    languages = languages.filter((l: string) => l != lang);
    this.$store.commit("setFilters", {
      ...this.$store.getters.filters,
      languages,
    });
    eventBus.$emit("filterQuestions", {
      ...this.$store.getters.filters,
      languages,
    });
  }

  clearTopic(topic: string) {
    let topics = this.$store.getters.filters.topics;
    topics = topics.filter((t: string) => t != topic);
    this.$store.commit("setFilters", {
      ...this.$store.getters.filters,
      topics,
    });
    eventBus.$emit("filterQuestions", {
      ...this.$store.getters.filters,
      topics,
    });
  }

  clearTag(tag: string) {
    let tags = this.$store.getters.filters.tags;
    tags = tags.filter((t: string) => t != tag);
    this.$store.commit("setFilters", {
      ...this.$store.getters.filters,
      tags,
    });
    eventBus.$emit("filterQuestions", {
      ...this.$store.getters.filters,
      tags,
    });
  }

  mounted() {
    console.log("this.$store.getters.filters", this.$store.getters.filters);
  }

  clearFilter() {
    console.log("clearFilter");
    const user = AuthStoreModule.currentUser as any;

    if (!user && this.$store.getters.isCleared) {
      alert("Login Requried for your default");
    }
    if (user && this.$store.getters.isCleared) {
      let filter = {
        topics: user.userToppics,
        tags: [],
        languages: user.userLanguages,
        sortBy: "newest",
      };
      this.$store.commit("setFilters", filter);
      eventBus.$emit("filterQuestions", filter);
      return;
    }
    this.$store.commit("setFilters", null);
    eventBus.$emit("filterQuestions", null);
  }
}
</script>
<style>
.logo-link {
  text-decoration: none; /* Remove underline */
  color: black !important; /* Inherit color from parent */
}
</style>
