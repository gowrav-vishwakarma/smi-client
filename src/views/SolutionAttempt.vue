<template lang="pug">
  v-container.smi-meeting-wrapper
    div(style="height: 100vh" v-if="solutionAttempt && solutionAttempt._id")
      vue-jitsi-meet(ref="jitsiRef" domain="meet.jit.si" :options="jitsiOptions" v-if="!showRatingDialog")
      v-dialog(v-model="showRatingDialog" max-width="400")
        SolutionRatingForm(:solutionAttemptDetail="solutionAttempt")
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

@Component({
  name: "SolutionAttempt",
  components: {
    VueJitsiMeet: JitsiMeet,
    SolutionRatingForm,
  },
})
export default class SolutionAttempt extends Mixins(General) {
  // eslint-disable-next-line
  @Ref("jitsiRef") private jitsiRefComponent!: HTMLIFrameElement;

  showRatingDialog = false;

  solutionAttempt: any | null = null;

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
        TOOLBAR_BUTTONS: [
          "microphone",
          "camera",
          "desktop",
          "fullscreen",
          "hangup",
          "chat",
          "settings",
          // "tileview",
        ],
      },
      onload: this.onIFrameLoad,
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
    // this.$router.push("/");
    // this.$router.push("/question/" + this.solutionAttempt.questionId);
  }

  videoConferenceLeft(event: any) {
    console.log("callbackevent video conference left");
    this.showRatingDialog = true;
  }

  onParticipantJoined(event: any) {
    console.log("Participent joined", event);
    // alert("participent joinded");
    this.$vToastify.success({
      successDuration: 2000,
      body: event.displayName + " Joined",
    });
  }
}
</script>
<style>
.smi-meeting-wrapper .leftwatermark {
  display: none !important;
}
</style>
