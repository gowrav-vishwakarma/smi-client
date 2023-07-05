<template lang="pug">
  v-sheet
    v-card(flat)
      v-card-title
      v-card-text
        div(v-show="recording")
          video(id="myVideo" class="video-js vjs-default-skin")
      v-card-actions
        v-btn(@click="startRecording" v-if="!recording")
          v-icon(right dark color="red" class="mr-3") mdi-record
          | Start Recording
        v-btn(@click="stopRecording" v-else)
          v-icon(right dark color="red" class="mr-3") mdi-pause
          | Stop Recording
</template>

<script>
/* eslint-disable */
import "videojs-record/dist/css/videojs.record.css";
import "video.js/dist/video-js.css";
import videojs from "video.js";

import "webrtc-adapter";
import RecordRTC from "recordrtc";

// the following imports are only needed when you're recording
// audio-only using the videojs-wavesurfer plugin
/*
    import WaveSurfer from 'wavesurfer.js';
    import MicrophonePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.microphone.js';
    WaveSurfer.microphone = MicrophonePlugin;

    // register videojs-wavesurfer plugin
    import videojs_wavesurfer_css from 'videojs-wavesurfer/dist/css/videojs.wavesurfer.css';
    import Wavesurfer from 'videojs-wavesurfer/dist/videojs.wavesurfer.js';
    */

import Record from "videojs-record/dist/videojs.record.js";

export default {
  data() {
    return {
      recording: false,
      player: "",
      options: {
        controls: false,
        autoplay: false,
        fluid: false,
        loop: false,
        width: 80,
        height: 60,
        bigPlayButton: false,
        controlBar: {
          volumePanel: true,
          fullscreenToggle: false,
        },
        plugins: {
          record: {
            maxLength: 300,
            audio: true,
            video: false,
            debug: true,
            screen: true,
          },
        },
      },
    };
  },
  mounted() {
    /* eslint-disable no-console */
    this.player = videojs("#myVideo", this.options, () => {
      // print version information at startup
      var msg =
        "Using video.js " +
        videojs.VERSION +
        " with videojs-record " +
        videojs.getPluginVersion("record") +
        " and recordrtc " +
        RecordRTC.version;
      videojs.log(msg);
    });

    // device is ready
    this.player.on("deviceReady", () => {
      this.player.record().start();
      console.log("device is ready!");
    });

    // user clicked the record button and started recording
    this.player.on("startRecord", () => {
      this.$emit("recording-started", true);
      console.log("started recording!");
    });

    // user completed recording and stream is available
    this.player.on("finishRecord", () => {
      // the blob object contains the recorded data that
      // can be downloaded by the user, stored on server etc.
      this.$emit("recording-finished", this.player.recordedData);
      console.log("finished recording: ", this.player.recordedData);
    });

    // error handling
    this.player.on("error", (element, error) => {
      this.recording = false;
      console.warn(error);
    });

    this.player.on("deviceError", () => {
      console.error("device error:", this.player.deviceErrorCode);
    });
  },

  methods: {
    async stopRecording() {
      this.recording = false;
      await this.player.record().stop();
    },

    async startRecording() {
      this.recording = true;
      await this.player.record().getDevice();
    },
  },

  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  },
};
</script>
