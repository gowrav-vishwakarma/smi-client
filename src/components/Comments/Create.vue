<template lang="pug">
div
  v-card.d-flex.flex-column.smi-comment-create-card(tile :key="key")
      v-card-text Your answer/comment
        span.ml-1(style="color:red;") *
        vue-editor.mt-2(v-model="comment" :editor-toolbar="editorToolbar")
        //VideoJsRecord.mt-5(ref="VideoJsRecordCommentRef" v-if="isRecordingEnabled" @recording-started="recordingStarted"  @recording-finished="recordingFinished" :defaultRecordingMode="recordingMode")
        MulticorderUI(style="max-width:300px;margin:10px auto 0 auto !important;" ref="MulticoderUIComment" v-if="isRecordingEnabled" @recorderOndataavailable="recordingFinished" @delete-recording="deleteRecording" @video-change="recordingStarted")
      v-alert.ml-4.mr-4(dense type="error" v-if="showError")  answer/comment is mandatory
      v-card-actions.pl-3.pr-3
        v-btn(block :loading="progress > 0" v-if="this.$store.getters.loggedInUser" @click="submitComment" color="primary") Submit Answer
        v-btn(v-else block color="secondary" @click="redirectToLogin" ) Login to Answer
</template>

<script lang="ts">
import "reflect-metadata";
import { Component, Prop, Vue, Ref, Watch } from "vue-property-decorator";
import { VueEditor } from "vue2-editor";
import commentsAPIService from "@/services/comments.api";
import { AuthStoreModule } from "@/store";
// import VideoJsRecord from "@/components/Multicorder/VideoJsRecord.vue";
import { eventBus } from "@/mixins/event-bus";
import MulticorderUI from "@/components/Multicorder/MulticorderUI.vue";

@Component({
  name: "CreateCommentComponent",
  components: {
    VueEditor,
    // VideoJsRecord,
    MulticorderUI,
  },
})
export default class CreateCommentComponent extends Vue {
  @Ref("VideoJsRecordCommentRef") private VideoJsRecordCommentRef!: HTMLElement;
  @Ref("MulticoderUIComment") private MulticoderUIComment!: HTMLElement;

  @Prop({ default: null })
  readonly question!: any;

  isRecordingOn = false;
  recordingData: any = null;
  progress = 0;
  videoAutoStop = false;
  showError = false;
  key = 0;

  get isRecordingEnabled() {
    return process.env.VUE_APP_ENABLE_RECORDING == "true";
  }
  get recordingMode() {
    return null;
  }

  comment = "";
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

  @Watch("comment")
  onDetailsChanged(newValue: string) {
    this.showError = newValue.trim() === "";
  }

  async submitComment() {
    if (this.comment == "" || this.comment.length == 0) {
      this.showError = true;
      return;
    }

    eventBus.$emit("show-loader");
    // if (this.isRecordingOn) {
    //   await (this.VideoJsRecordCommentRef as any).stopRecording();
    //   this.videoAutoStop = true;
    //   console.log("auto stopping recording");
    //   return;
    // }

    if (this.isRecordingOn) {
      await (this.MulticoderUIComment as any).videoStopRecording();
      while (!this.recordingData) {
        this.videoAutoStop = true;
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return;
    }

    this.progress = 1;
    if (!this.videoAutoStop) {
      await commentsAPIService
        .createComment(
          this.question._id,
          this.comment,
          this.recordingData,
          (event) => {
            this.progress = Math.round((100 * event.loaded) / event.total);
          }
        )
        .then(() => {
          AuthStoreModule.setDraftFormAction(null);
          // console.log(res);
          this.comment = "";
          this.recordingData = null;
          this.isRecordingOn = false;
          this.progress = 0;
          this.key++;
          this.$emit("event-new-comment-created");
        });
    }

    eventBus.$emit("hide-loader");
  }

  redirectToLogin() {
    if (!this.$store.getters.isAuthenticated) {
      // todo store value into store
      AuthStoreModule.setDraftFormAction({
        path: this.$route.path,
        formName: "QuestionAnswerForm",
        formData: {
          questionId: this.question._id,
          comment: this.comment,
        },
      });

      this.$store.commit("setLoginSuccessRedirectUrl", this.$route.path);
      this.$router.push("/login");
    }
  }

  mounted() {
    if (
      AuthStoreModule.draftQuestionAnswerForm &&
      AuthStoreModule.draftQuestionAnswerForm.path == this.$route.path &&
      AuthStoreModule.draftQuestionAnswerForm.formData.questionId ==
        this.question._id
    ) {
      this.comment = AuthStoreModule.draftQuestionAnswerForm.formData.comment;
    }
  }

  recordingStarted() {
    this.isRecordingOn = true;
    console.log("recording started ...");
  }

  async recordingFinished(data) {
    this.isRecordingOn = false;
    this.recordingData = data;
    console.log("recording finished ...", data);
    if (this.videoAutoStop) {
      this.videoAutoStop = false;
      await this.submitComment();
    }
  }

  deleteRecording(index: number) {
    if (index === 0) this.recordingData = null;
  }
}
</script>

<style>
.smi-comment-create-card .ql-editor {
  min-height: 100px !important;
}
</style>
