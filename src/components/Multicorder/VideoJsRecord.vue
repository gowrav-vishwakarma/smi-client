<template lang="pug">
  v-card.mt-10
    v-row
      v-col(cols="12" sm="12" md="6" lg="6" xs="12")
        v-card.ml-5(v-show="recording" flat)
          v-card-text
            video(ref="videoPlayer" id="myVideo" class="video-js vjs-default-skin" style="width:100%;height:150px;")
      v-col(cols="12" sm="12" md="6" lg="6" xs="12" style="align-items:center;")
          v-card(flat)
            v-card-actions(v-if="!recording")
              v-btn(v-if="defaultRecordingMode" small  block dark @click="startRecording")
                v-icon(right dark color="red" class="mr-3") mdi-record
                | {{startBtnName}}
              v-menu(top offset-y v-else )
                template(v-slot:activator="{ on, attrs }")
                  v-btn(small  v-if="!recording" block dark v-bind="attrs" v-on="on")
                    v-icon(right dark color="red" class="mr-3") mdi-record
                    | {{startBtnName}}
                v-list(dense)
                  v-list-item(@click="changeRecordingMode('video')" style="background-color:var(--v-primary-lighten3) !important")
                    v-list-item-icon
                      v-icon mdi-video-outline
                    v-list-item-content
                      v-list-item-title Start video Recording
                  v-list-item(@click="changeRecordingMode('screen')" style="background-color:var(--v-warning-lighten3) !important")
                    v-list-item-icon
                      v-icon mdi-monitor
                    v-list-item-content
                      v-list-item-title Start Screen Recording
            v-card-actions(v-else)
              v-btn(small @click="stopRecording" block dark)
                v-icon(right dark color="red" class="mr-3") mdi-pause
                | {{stopBtnName}}
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
import * as string from "string";

export default {
  props: {
    defaultRecordingMode: null,
  },
  data() {
    return {
      recordingMode: "selection",
      triggerRecordingFinish: false,
      recording: false,
      player: "",
      startBtnName: "Start Recording",
      stopBtnName: "Stop Recording",
      options: {
        controls: true,
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

  // computed: {
  //
  // },
  async mounted() {
    if (this.defaultRecordingMode) {
      await this.changeRecordingMode(this.defaultRecordingMode);
    }
    await this.makePlayer();
  },

  methods: {
    async stopRecording() {
      if (!this.defaultRecordingMode) this.recording = false;
      await this.player.record().stop();
    },

    async startRecording() {
      this.recording = true;
      await this.player.record().getDevice();
    },

    async changeRecordingMode(channel) {
      if (channel === "video") {
        this.options.plugins.record.screen = false;
        this.options.plugins.record.video = true;
        if (this.player) {
          this.player.record().recordScreen = false;
          this.player.record().recordVideo = true;
        }
      }

      if (channel === "screen") {
        this.options.plugins.record.screen = true;
        this.options.plugins.record.video = false;
        if (this.player) {
          this.player.record().recordScreen = true;
          this.player.record().recordVideo = false;
        }
      }

      if (this.player) {
        this.$nextTick(async () => {
          // await this.makePlayer(this.options);
          await this.startRecording();
        });
      }
    },

    playerOptions() {
      return this.options;
    },

    async makePlayer(options = null) {
      if (options == null) {
        options = this.playerOptions();
      }

      this.player = await videojs(this.$refs.videoPlayer, options, () => {
        // print version information at startup
        var msg =
          "Using video.js " +
          videojs.VERSION +
          " with videojs-record " +
          videojs.getPluginVersion("record") +
          " and recordrtc " +
          RecordRTC.version;
        videojs.log(msg);
        console.log(msg);
      });
      // device is ready
      this.player.on("deviceReady", () => {
        let devices = this.player.record().devices;
        console.log("devices", devices);
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
  },

  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  },

  // watch: {
  //   async triggerRecordingFinish(newv, old) {
  //     console.log(newv);
  //     console.log(old);
  //     await this.stopRecording();
  //   },
  // },
};
</script>
