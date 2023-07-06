<template lang="pug">
div.questionFilterComponent
  v-form(ref="filterForm" v-model="valid")
    v-text-field(label="Question Contains" placeholder="your search query" dense small outlined v-model="filterQuery.query")
    treeselect.mb-2.mt-n5(v-model="filterQuery.topics" :multiple="true" :options="topicsInterestedIn" placeholder="Select Topics of Interests")

    //- v-autocomplete(v-model="filterQuery.topics" dense small multiple :items="topics" small-chips label="Topic" outlined)
    //-   template(v-slot:selection="data")
    //-     v-chip(v-bind="data.attrs" :input-value="data.selected" close @click="data.select" @click:close="remove(data.item)")
    //-       | {{ data.item.split("/").reverse()[0] }}
    v-autocomplete(v-model="filterQuery.languages" dense small multiple :items="languageList" small-chips label="Languages" outlined)
    v-combobox(v-model="filterQuery.tags" dense small outlined label="Tags" multiple small-chips clearable :delimiters="[',']" deletable-chips)
    //- todo filters
    //- v-autocomplete(:items="languageList" dense small v-model="filterQuery.languages" multiple label="Language" outlined)
    //- v-checkbox(label="questions having answer" dense small v-model="filterQuery.hasComments") 
    //div Available for solution
    .d-flex(style="align-items:center;flex-wrap:wrap;")
      v-checkbox(style="width:50%;" label="Chat" dense v-model="filterQuery.availableOnChatChannel")
      v-checkbox(style="width:50%;" label="Screen Share" dense v-model="filterQuery.availableOnScreenShare")
      v-checkbox(style="width:50%;" label="Video Call" dense v-model="filterQuery.availableOnVideoCall")
      v-checkbox(style="width:50%;" label="Audio Call" dense v-model="filterQuery.availableOnAudioCall")
    v-row
      v-col(cols="6")
        v-btn(color="grey"  @click="dialogClose" :disabled="!valid" block) Close
      v-col(cols="6")
        v-btn(color="primary" @click="filterFormSubmit" :disabled="!valid" block) Search
</template>

<script lang="ts">
import {
  topics_,
  topics,
  languages,
  getFlatTopics,
  Topic,
} from "@/services/staticValues";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import { VueEditor } from "vue2-editor";
import MulticorderUI from "@/components/Multicorder/MulticorderUI.vue";
import questionsApi from "@/services/questions.api";

@Component({
  name: "QuestionFilters",
  components: {
    VueEditor,
    MulticorderUI,
    Treeselect,
  },
})
export default class AskQuestionView extends Vue {
  @Prop()
  callback!: (any: any) => void;

  progress = 0;
  blob = null;
  filterQuery = {
    query: "",
    topics: null,
    tags: [],
    languages: [],
    hasComments: null,
    availableOnChatChannel: null,
    availableOnScreenShare: null,
    availableOnVideoCall: null,
    availableOnAudioCall: null,
  };

  // topics: string[] = getFlatTopics(topics_);;
  topicsInterestedIn: Topic[] = topics;
  valid = false;
  languageList: string[] = languages;

  async filterFormSubmit() {
    console.log("filterFormSubmit", this.filterQuery);

    if (this.callback) {
      await this.callback(this.filterQuery);
    }

    // this.progress = 0;
    // var data = this.question;
    // data.languages = this.$store.getters.loggedInUser.userLanguages;
    // const newQuestion = await questionsApi.createQuestion(
    //   this.question,
    //   this.blob,
    //   (event) => {
    //     this.progress = Math.round((100 * event.loaded) / event.total);
    //   }
    // );
    // this.$router.push("question/" + newfilterQuery._id);
  }

  @Watch("$store.getters.filters", { immediate: true })
  onFilterChange() {
    if (this.$store.getters.filters) {
      this.filterQuery = this.$store.getters.filters;
    }
  }

  dialogClose() {
    this.callback(undefined);
  }

  mounted() {
    this.filterQuery = this.$store.getters.filters;
  }
}
</script>
