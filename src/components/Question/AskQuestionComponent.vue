<template>
  <v-card class="mb-12" color="">
    <v-card-title>
      <span class="headline"
        >New Question: Ask
        {{ askToUser ? "'" + askToUser.name + "'" : "Publicly" }}</span
      >
    </v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-text-field
          label="Question Title"
          v-model="question.title"
          :rules="[
            (v) => !!v || 'Required',
            (v) => v.length <= 250 || 'Too long',
          ]"
          outlined
          dense
        ></v-text-field>

        <div>Question Detail</div>
        <vue-editor
          :editorToolbar="editorToolbar"
          v-model="question.detail"
        ></vue-editor>

        <treeselect
          class="mb-2 mt-2"
          :multiple="true"
          v-model="question.topic"
          :options="topicsInterestedIn"
          value-consists-of="ALL_WITH_INDETERMINATE"
          sort-value-by="LEVEL"
          :rules="[(v) => !!v || 'Required']"
          placeholder="Select Topics"
        ></treeselect>

        <v-combobox
          v-model="question.tags"
          label="Tags"
          multiple
          small-chips
          clearable
          :delimiters="[',']"
          deletable-chips
          outlined
          dense
          hint="you can associate multiple tags with your question. for multiple tag `type your tag name and end with comma(,) ie. tech, `"
        ></v-combobox>
        <v-autocomplete
          v-model="question.scope"
          :items="['Private', 'Public']"
          label="Question Visibility"
          required
          :rules="[(v) => !!v || 'Question Visibility is required']"
          outlined
          dense
          class="mt-4"
        ></v-autocomplete>

        <v-row class="mt-2">
          <v-col cols="12" sm="6">
            <v-card>
              <v-card-title primary-title>
                How you need the solution
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-checkbox
                  label="I can share-screen also if needed"
                  v-model="question.solutionChannels.screenShare"
                >
                </v-checkbox>
                <v-checkbox
                  label="Open for Video call if needed"
                  v-model="question.solutionChannels.videoCall"
                >
                </v-checkbox>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-card>
              <v-card-title primary-title> Record your issue </v-card-title>
              <v-divider></v-divider>

              <v-card-text>
                Record your issue for better explanation
                <MulticorderUI
                  ref="MulticoderUI"
                  @recorderOndataavailable="recorderOndataavailable"
                  @delete-recording="deleteRecording"
                />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-form>
      <v-progress-linear class="mt-2" v-model="progress"></v-progress-linear>
    </v-card-text>
    <div
      v-if="showDetailError"
      class="v-messages d-flex justify-center theme--light error--text"
    >
      {{ ErrorText }}
    </div>
    <v-card-actions>
      <v-btn
        color="success"
        class="mt-5"
        @click="createQuestion"
        :disabled="!valid"
        block
      >
        Create
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import {
  topics_,
  topics,
  getFlatTopics,
  languages,
  Topic,
} from "@/services/staticValues";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import { VueEditor } from "vue2-editor";
import MulticorderUI from "@/components/Multicorder/MulticorderUI.vue";
import questionsApi from "@/services/questions.api";
import userApi from "@/services/user.api";

@Component({
  components: {
    VueEditor,
    MulticorderUI,
    Treeselect,
  },
})
export default class AskQuestionView extends Vue {
  @Prop({ default: null }) askTo!: string | null;

  askToUser: any = null;

  ErrorText = "Question title, detail and topics are must";

  progress = 0;
  blob = null;
  question = {
    topic: [],
    title: "",
    detail: "",
    tags: [],
    languages: [],
    solutionChannels: {
      comments: true,
      chat: true,
      screenShare: true,
      audioCall: true,
      videoCall: true,
    },
    scope: "Public",
    askTo: "",
  };
  topicsInterestedIn: Topic[] = topics;
  valid = false;
  showDetailError = false;

  editorToolbar = [
    [{ header: [false, 1, 2, 3, 4, 5, 6] }],
    ["bold", "italic", "underline", "strike"], // toggled buttons
    [
      { align: "" },
      { align: "center" },
      { align: "right" },
      { align: "justify" },
    ],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    ["link"], // temp remove image and video it has a hook for image upload also ["link", "image", "video"],
    ["clean"], // remove formatting button
  ];

  @Watch("askTo")
  async askToChanged() {
    if (this.askTo) {
      this.askToUser = await userApi.getProfileByToken(this.askTo);
      this.question.askTo = this.askTo;
    }
  }

  @Watch("question.detail")
  onDetailsChanged(newValue: string) {
    if (newValue.trim() === "") {
      this.showDetailError = true;
    } else {
      this.showDetailError = false;
      this.valid = true;
    }
  }

  @Watch("question.topic")
  onTopicsChanged(newValue: string[]) {
    if (newValue.length === 0) {
      this.showDetailError = true;
    } else {
      this.showDetailError = false;
      this.valid = true;
    }
  }

  deleteRecording(index: number) {
    if (index === 0) this.blob = null;
  }

  recorderOndataavailable(blob: any) {
    this.blob = blob;
  }

  removeSkill(item: string) {
    this.question.topic = [
      ...this.question.topic.filter((x: string) => x !== item),
    ];
  }

  async createQuestion() {
    if (
      this.question.detail.trim() === "" ||
      this.question.title.trim() === "" ||
      this.question.topic.length === 0
    ) {
      this.showDetailError = true;
      this.valid = false;
      return;
    }
    this.progress = 0;
    var data = this.question;
    data.languages = this.$store.getters.loggedInUser.userLanguages;
    const newQuestion = await questionsApi.createQuestion(
      this.question,
      this.blob,
      (event) => {
        this.progress = Math.round((100 * event.loaded) / event.total);
      }
    );
    this.$router.push("question/" + newQuestion._id);
  }
}
</script>
