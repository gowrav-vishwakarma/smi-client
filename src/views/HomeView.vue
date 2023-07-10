<template lang="pug">
  v-container.pt-1(style="width: 100%; max-width: 100%")
    v-container.d-flex.justify-space-between.pa-0.mb-2(style='width: 100%; align-items: center')
      div(style='width: 100%')
        v-chip-group( style='width: 100%')
          v-chip(small color='red lighten-1 white--text' @click='clearFilter') {{ $store.getters.isCleared ? 'Default Filter':'Clear Filter' }}
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
    v-row
      <!-- <v-col cols="12" sm="2" md="2" lg="2">
        <v-sheet rounded="lg" min-height="268">
          <topic-list></topic-list>
        </v-sheet>

        <v-sheet rounded="lg" min-height="268" class="mt-3">
          Topics
          <topic-list getTopicList="true"></topic-list>
        </v-sheet>
      </v-col> -->
      v-col(cols="12" sm="9" md="9" lg="9")
        question-list
      v-col(cols="12" sm="3" md="3" lg="3")
        v-sheet(rounded="lg" min-height="268")
</template>

<script lang="ts">
import QuestionList from "@/components/Question/List.vue";
import TopicList from "@/components/Topic/List.vue";
import { Component, Vue } from "vue-property-decorator";
import { eventBus } from "@/mixins/event-bus";
import { AuthStoreModule } from "@/store";

@Component({
  components: {
    QuestionList,
    TopicList,
  },
})
export default class HomeView extends Vue {
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
}
</script>
