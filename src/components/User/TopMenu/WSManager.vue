<template lang="pug">
div
  v-icon(small :color="statusColor") mdi-circle
  div.extra-component
    div.call-receive-ringing
      audio(ref="incomingCallRingingPlayer")
        source(src="@/assets/audio/callRingingTone.mp3" type="audio/mpeg" preload="auto")
</template>

<script lang="ts">
import { Component, Vue, Ref } from "vue-property-decorator";
import socket, { SocketOn, SocketEmit } from "@/services/socket";
import { SocketAuthDTO } from "@/dto/ws.dto";
import solutionsApi from "@/services/solutions.api";
import { AuthStoreModule } from "@/store";
import userApi from "@/services/user.api";

import callDialToneMP3 from "@/assets/audio/callDialTone.mp3";
const callDialTone: string = callDialToneMP3;

@Component({
  name: "WSManager",
})
export default class WSManager extends Vue {
  @Ref() incomingCallRingingPlayer!: HTMLAudioElement;

  isConnected = false;
  audioContext: any = null;
  audioBuffer: any = null;
  // callDialTone: callDialToneMP3;

  // userOnlineStatus = "Offline";

  created() {
    this.socketConnect();
    // this.loadAudio();
    // this.playSoundWithNotification();
  }

  destroyed() {
    socket.disconnect();
  }

  socketConnect() {
    if (!this.$store.getters.isAuthenticated) {
      console.log("Not connecting to socket because user is not authenticated");
      return;
    }
    const username = this.$store.getters.loggedInUser._id;

    socket.auth = { username };
    socket.connect();

    SocketOn("connect", () => {
      this.isConnected = true;
      console.log("connect", socket.id);
      userApi.setOnlineStatus("ONLINE");
      AuthStoreModule.updateUserOnlineStatusAction("ONLINE");
    });

    SocketOn("connect_error", (err) => {
      console.error(err);
    });

    // SocketOn(
    //   "session",
    //   (data: any) => {
    //     socket.auth = { username };
    //     this.isConnected = true;

    //     // if (this.$store.getters.userOnlineStatus == null) {
    //     AuthStoreModule.updateUserOnlineStatusAction("Online");
    //     //call api to update user status
    //     // }
    //   },
    //   SocketAuthDTO
    // );

    SocketOn("ringing", (payload) => {
      console.log("call-receive", payload);
      // when ringing remove previous toast
      this.$vToastify.removeToast();

      this.$vToastify
        .prompt({
          title: `${payload.from.name} calling`,
          body: `for "${payload.questionTitle}"`,
          answers: { Accept: true, Denied: false },
        })
        .then(async (callAccept: boolean) => {
          // let newFrom = Object.assign({}, payload.from);
          let newPayload = Object.assign({}, payload);

          newPayload.to = payload.from._id;
          newPayload.from = payload.to;
          newPayload.callAccept = callAccept;
          if (callAccept && payload) {
            const solutionOffer = await solutionsApi.createSolutionAttempt({
              questionId: payload.questionId,
              questionerId: payload.from._id,
              questioner: {
                name: payload.from.name,
                email: payload.from.email,
              },
              offererId: payload.to,
              offerer: {
                name: payload.offerer.name,
                ratingAsSolver: payload.offerer.ratingAsSolver,
              },
              notes: payload.eventDetail.name,
            });

            newPayload.solutionOfferId = solutionOffer._id;
            SocketEmit("acceptCall", newPayload);

            await AuthStoreModule.updateUserOnlineStatusAction("BUSY");
            /** call accepted buy offerer end user - so redirecting to solution-attempt page*/
            this.$router.push(
              "/solution-attempt/" + newPayload.solutionOfferId
            );
          } else {
            SocketEmit("denyCall", newPayload);
          }
        });
    });

    SocketOn("callAccepted", async (payload) => {
      console.log("callAccepted at single offer component", payload);
      //temporary commenting condition
      // if (
      //   payload.offerId == this.offer._id &&
      //   payload.questionId == this.question._id &&
      //   (this.questionBelongsToMe || this.offerBelongsToMe)
      // ) {
      this.callReset();
      // this.userOnlineStatus = "Busy";
      userApi.setOnlineStatus("BUSY");
      await AuthStoreModule.updateUserOnlineStatusAction("BUSY");
      // this.offerCallConnected = true;
      this.$router.push("/solution-attempt/" + payload.solutionOfferId);
      // }
    });

    SocketOn("callDenied", (payload) => {
      this.callReset();
    });

    SocketOn("callDisconnected", (payload) => {
      this.callReset();
      console.log("callDisconnected", payload);
    });

    SocketOn("callHanguped", (payload) => {
      this.callReset();
      console.log("call Hanguped", payload);
    });

    SocketOn("OfferPlaced", (payload) => {
      console.log("OfferPlaced", payload);
      this.$vToastify
        .prompt({
          title: `${payload.solverName} placed a offer on`,
          body: `"${payload.questionTitle}"`,
          answers: { "Go to question": true, Close: false },
        })
        .then((gotoPage: boolean) => {
          if (gotoPage) {
            this.$router.push("/question/" + payload.questionId);
          }
        });
    });

    SocketOn("questionAskedTo", (payload) => {
      console.log("questionAskedTo", payload);
      this.$vToastify
        .prompt({
          title: `${payload.name} asked a question to you`,
          body: `"${payload.title}"`,
          answers: { "Go to question": true, Close: false },
        })
        .then((gotoPage: boolean) => {
          if (gotoPage) {
            this.$router.push("/question/" + payload.questionId);
          }
        });
    });
  }

  callReset() {
    this.$vToastify.removeToast();
    // this.callRingingPlayer.pause();
    // this.callDialPlayer.pause();
  }

  playSound(forType: string) {
    this.incomingCallRingingPlayer.play();

    // if (forType == "ringing") {
    //   console.log("Play Sound in ws manager");
    //   let data = {
    //     soundurl:
    //       "http://soundbible.com/mp3/analog-watch-alarm_daniel-simion.mp3",
    //   };
    //   var audio = new Audio(data.soundurl);
    //   audio.play();
    // }
  }

  async loadAudio() {
    try {
      const response = await fetch(callDialTone);
      const arrayBuffer = await response.arrayBuffer();
      this.audioContext = new window.AudioContext();
      this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.error(error);
    }
  }

  get statusColor() {
    return this.isConnected && this.$store.getters.userOnlineStatus == "BUSY"
      ? "orange"
      : this.isConnected && this.$store.getters.userOnlineStatus == "ONLINE"
      ? "green"
      : "red";
  }

  async playSoundWithNotification() {
    if (!this.audioBuffer) return;

    if (!this.audioContext) {
      this.audioContext = new window.AudioContext();
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = this.audioBuffer;
    source.connect(this.audioContext.destination);
    source.start(0);
  }
}
</script>
