<template lang="pug">
v-app-bar(app='' color='white' flat='')
  router-link.d-flex.align-center(to="/" class="logo-link")
    v-toolbar-title.mx-2(to='/') [smi]
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
  auth-dialog(:showdialog.sync='AuthDialogState')
  // selected filter options
  template(v-slot:extension='' v-if='isFilterSelected')
    v-container.d-flex.justify-space-between.grey.lighten-5.pa-0.mt-1(style='width: 100%; align-items: center')
      div(style='width: 100%')
        v-chip-group(v-if='$store.getters.filters' style='width: 100%')
          v-chip(small='' color='orange white--text')  Filters: 
          v-chip(small='' v-if='$store.getters.filters.query')
            | {{ $store.getters.filters.query }}
          //- v-chip(small='' v-for='t in $store.getters.filters.topics' :key="'t' + t")
          //-   | {{ t }}
          v-chip(small v-if="$store.getters.filters.topics && $store.getters.filters.topics.length")
            span 
              b topics: &nbsp;
            span.v-chip__content(v-for='t in $store.getters.filters.topics' :key="'t' + t") {{ t.split("/").reverse()[0] }} &nbsp;
          //- v-chip(small='' v-for='l in $store.getters.filters.languages' :key="'l' + l")
          //-   | {{ l }}
          v-chip(small v-if="$store.getters.filters.tags && $store.getters.filters.tags.length")
            span 
              b tags: &nbsp;
            span.v-chip__content(v-for='t in $store.getters.filters.tags' :key="'t' + t") {{ t }} &nbsp;
          v-chip(small v-if="solutionChannelFilterSelected")
            v-icon(small class="icon mr-2" color="green" v-if="$store.getters.filters.availableOnAudioCall") mdi-phone-incoming
            v-icon(small class="icon mr-2" color="green" v-if="$store.getters.filters.availableOnChatChannel") mdi-chat
            v-icon(small v-if="$store.getters.filters.availableOnScreenShare" color="green" class="mr-2") mdi-monitor
            v-icon(small color="green" class="mr-2" v-if="$store.getters.filters.availableOnVideoCall") mdi-video
      .mx-auto
        v-chip(small='' color='red lighten-1 white--text' @click='clearFilter')
          | Clear Filter
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TopMenu from "@/components/User/TopMenu/index.vue";
import AuthDialog from "@/components/User/AuthDialog.vue";
import FilterComponent from "@/components/Common/FilterComponent.vue";
import { eventBus } from "@/mixins/event-bus";
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

  clearFilter() {
    this.$store.commit("setFilters", undefined);
    eventBus.$emit("filterQuestions", undefined);
  }
}
</script>
<style>
.logo-link {
  text-decoration: none; /* Remove underline */
  color: black !important; /* Inherit color from parent */
}
</style>
