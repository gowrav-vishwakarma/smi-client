<template lang="pug">
v-container.smi-meeting-wrapper
  div(style="height: 80vh" v-if="solutionAttempt && solutionAttempt._id")
    vue-jitsi-meet(ref="jitsiRef" domain="meet.jit.si" :options="jitsiOptions" v-if="!showRatingDialog")
    v-dialog(v-model="showRatingDialog" width="70%")
      v-card(flat width="100%")
        v-row
          v-col(cols="5" sm="12" md="5" lg="5" xs="12")
            v-card.solution-video-comment-section(class="mx-auto" flat max-width="400px" )
              v-card-title Describe your solution
              v-card-subtitle Please take a few seconds to write your solution. It really helps other!
              v-card-text
                video(v-if="recordingData" id="recordingPlayer" class="video-js vjs-default-skin" style="width:100%;height:150px;")
                vue-editor(v-model="recordingText" :editor-toolbar="editorToolbar")
          v-col.pa-2(cols="2" sm="12" md="2" lg="2" xs="12" style="text-align:center;" )
            v-divider(vertical)
          v-col(cols="5" sm="12" md="5" lg="5" xs="12")
              SolutionRatingForm(:solutionAttemptDetail="solutionAttempt" :isMyQuestion="isMyQuestion" :recordingData="recordingData" :recordingText="recordingText")
    v-alert
      VideoJsRecord.mt-5(v-if="isRecordingEnabled" @recording-started="recordingStarted" @recording-finished="recordingFinished")
  div(v-else)
    P Meeting finished | Something went wrong
</template>

<script lang="ts">
import { Component, Mixins, Ref } from "vue-property-decorator";
import { General } from "@/mixins/general";
// import { JitsiMeet } from "@mycure/vue-jitsi-meet";
import SolutionRatingForm from "@/components/Common/SolutionRatingForm.vue";
import JitsiMeet from "@/components/Multicorder/JitsiMeet.vue";
import solutionApi from "@/services/solutions.api";
import VideoJsRecord from "@/components/Multicorder/VideoJsRecord.vue";
import "video.js/dist/video-js.css";
import videojs from "video.js";
import { VueEditor } from "vue2-editor";

@Component({
  name: "SolutionAttempt",
  components: {
    VideoJsRecord,
    VueJitsiMeet: JitsiMeet,
    SolutionRatingForm,
    VueEditor,
  },
})
export default class SolutionAttempt extends Mixins(General) {
  // eslint-disable-next-line
  @Ref("jitsiRef") private jitsiRefComponent!: HTMLIFrameElement;

  showRatingDialog = false;
  solutionAttempt: any | null = null;
  isRecordingOn = false;
  recordingData: any = null;
  recordingText: string | null = null;
  player: any = null;

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

  get jitsiOptions() {
    return {
      roomName: this.$route.params.solutionId,
      width: "100%",
      noSSL: false,
      userInfo: {
        email: this.$store.getters.loggedInUser.email,
        displayName: this.$store.getters.loggedInUser.name,
      },
      // personID: "wedwds",
      personID: this.$store.getters.loggedInUser._id,
      configOverwrite: {
        disableDeepLinking: true,
        prejoinPageEnabled: false,
        enableNoisyMicDetection: false,
        screenshotCapture: {
          enabled: true,
          mode: "always",
        },
        fileRecordingsServiceEnabled: true,
        localRecording: {
          enabled: true,
          format: "flac",
        },
        disableRemoteControl: true,
        hideConferenceTimer: true,
        remoteVideoMenu: {
          disableKick: true,
          disableGrantModerator: true,
        },
        subject: "Solving Issue Room",
      },
      interfaceConfigOverwrite: {
        FILM_STRIP_MAX_HEIGHT: "0.1",
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_CHROME_EXTENSION_BANNER: false,
        TOOLBAR_ALWAYS_VISIBLE: true,
        // TOOLBAR_BUTTONS: [
        //   "microphone",
        //   "camera",
        //   "desktop",
        //   "fullscreen",
        //   "hangup",
        //   "chat",
        //   "settings",
        //   // "tileview",
        // ],
      },
      onload: this.onIFrameLoad,
    };
  }

  get isMyQuestion() {
    return (
      this.$route.params.solutionId == this.solutionAttempt.questionId &&
      this.solutionAttempt.questionerId == this.$store.getters.loggedInUser._id
    );
  }

  get commentDetail() {
    return {
      videoBlob: this.recordingData,
      commentText: "this is video recording for my solution",
    };
  }
  async mounted() {
    if (this.$route.params && this.$route.params.solutionId) {
      this.solutionAttempt = await solutionApi.getSolutionAttempt(
        this.$route.params.solutionId
      );
    }
  }

  onIFrameLoad(event: any) {
    console.log("callbackevent on iframe loaded callback function ", event);

    this.jitsiRefComponent.addEventListener(
      "participantJoined",
      this.onParticipantJoined
    );
    this.jitsiRefComponent.addEventListener(
      "participantLeft",
      this.onParticipantLeft
    );
    this.jitsiRefComponent.addEventListener(
      "videoConferenceLeft",
      this.onParticipantLeft
    );

    // let iframeObj = document.getElementsByClassName(
    //   ".smi-meeting-wrapper iframe body"
    // );
    // console.log("selector", iframeObj);
  }

  onParticipantLeft(event: any) {
    console.log("callbackevent onParticipant Left roomName", event);
    // this.$vToastify.success(event.displayName + " Left");

    this.showRatingDialog = true;
    this.$nextTick(() => this.showRecording());

    // this.$router.push("/");
    // this.$router.push("/question/" + this.solutionAttempt.questionId);
  }

  videoConferenceLeft(event: any) {
    console.log("callbackevent video conference left");
    this.showRatingDialog = true;
    this.$nextTick(() => this.showRecording());
  }

  onParticipantJoined(event: any) {
    console.log("Participent joined", event);
    // alert("participent joinded");
    this.$vToastify.success({
      successDuration: 2000,
      body: event.displayName + " Joined",
    });
  }

  showRecording() {
    console.log("show recording");

    // If the player has already been initialized, use the existing player
    if (this.player) {
      // Use the existing player
    } else {
      // Initialize the player
      this.player = videojs("recordingPlayer", {
        controls: true,
        width: 600,
        height: 300,
        fluid: false,
        plugins: {},
      });
    }

    if (this.recordingData) {
      let blobUrl = URL.createObjectURL(this.recordingData);
      this.player.src({
        type: "video/webm",
        src: blobUrl,
      });
      this.player.load();
      this.player.play();
    }
  }

  recordingStarted() {
    this.isRecordingOn = true;
    console.log("recording started ...");
  }

  recordingFinished(data) {
    this.isRecordingOn = false;
    this.recordingData = data;
    console.log("recording finished ...", data);
  }
  get isRecordingEnabled() {
    console.log(
      "process.env.VUE_APP_ENABLE_RECORDING",
      process.env.VUE_APP_ENABLE_RECORDING
    );
    return process.env.VUE_APP_ENABLE_RECORDING == "true";
  }
}
</script>
<style>
.smi-meeting-wrapper .leftwatermark {
  display: none !important;
}
.solution-video-comment-section .ql-editor {
  min-height: 100px !important;
  max-height: 100px !important;
}
</style>
