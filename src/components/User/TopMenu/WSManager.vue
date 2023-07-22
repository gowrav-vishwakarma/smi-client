<template lang="pug">
div
  v-icon(v-if="showOnlineIcon" small :color="statusColor") mdi-circle
  div.notifymesnackbar
    v-snackbar(app v-model="snackbar" :timeout="5000" absolute bottom centered color="primary" ) Notifiy me about offer
      template(v-slot:action="{ attrs }")
        v-btn(color="orange" v-bind="attrs" @click="snackbar = false;") OK
  div.extra-component
    div.call-receive-ringing
      audio(ref="incomingCallRingingPlayer" loop="true")
        source(src="@/assets/audio/callRingingTone.mp3" type="audio/mpeg" preload="auto")
</template>

<script lang="ts">
import { Component, Vue, Ref, Prop } from "vue-property-decorator";
import socket, { SocketOn, SocketEmit } from "@/services/socket";
import solutionsApi from "@/services/solutions.api";
import { AuthStoreModule } from "@/store";
import userApi from "@/services/user.api";
// import { SocketAuthDTO } from "@/dto/ws.dto";

@Component({
  name: "WSManager",
})
export default class WSManager extends Vue {
  @Ref() incomingCallRingingPlayer!: HTMLAudioElement;

  snackbar = true;
  isConnected = false;
  isAudioPlaying = false;

  @Prop({ default: true })
  hideWSIcon!: boolean;

  get showOnlineIcon() {
    return this.hideWSIcon ? false : true;
  }

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
      this.playSound();

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
            const solutionAttemptOffer =
              await solutionsApi.createSolutionAttempt({
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
                offerId: payload.offerId,
              });

            this.pauseSound();
            newPayload.solutionOfferAttemptId = solutionAttemptOffer._id;
            SocketEmit("acceptCall", newPayload);

            await AuthStoreModule.updateUserOnlineStatusAction("BUSY");
            /** call accepted buy offerer end user - so redirecting to solution-attempt page*/
            this.$router.push(
              "/solution-attempt/" + newPayload.solutionOfferAttemptId
            );
          } else {
            this.pauseSound();
            SocketEmit("denyCall", newPayload);
          }
        });
    });

    SocketOn("callAccepted", async (payload) => {
      console.log("callAccepted at single offer component", payload);
      this.pauseSound();
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
      this.$router.push("/solution-attempt/" + payload.solutionOfferAttemptId);
      // }
    });

    SocketOn("callDenied", (payload) => {
      this.pauseSound();
      this.callReset();
    });

    SocketOn("callDisconnected", (payload) => {
      this.pauseSound();
      this.callReset();
      console.log("callDisconnected", payload);
    });

    SocketOn("callHanguped", (payload) => {
      this.pauseSound();
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

  get statusColor() {
    return this.isConnected && this.$store.getters.userOnlineStatus == "BUSY"
      ? "orange"
      : this.isConnected && this.$store.getters.userOnlineStatus == "ONLINE"
      ? "green"
      : "red";
  }

  playSound() {
    this.isAudioPlaying = true;
    this.incomingCallRingingPlayer.play();
  }

  pauseSound() {
    // Clean up the audio when the component is about to be destroyed
    if (this.isAudioPlaying) {
      this.incomingCallRingingPlayer.currentTime = 0;
      this.isAudioPlaying = false;
      this.incomingCallRingingPlayer.pause();
    }
  }

  // async loadAudio() {
  //   try {
  //     const response = await fetch(callDialTone);
  //     const arrayBuffer = await response.arrayBuffer();
  //     this.audioContext = new window.AudioContext();
  //     this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // async playSoundWithNotification() {
  //   if (!this.audioBuffer) return;
  //
  //   if (!this.audioContext) {
  //     this.audioContext = new window.AudioContext();
  //   }
  //
  //   const source = this.audioContext.createBufferSource();
  //   source.buffer = this.audioBuffer;
  //   source.connect(this.audioContext.destination);
  //   source.start(0);
  // }
}
</script>
