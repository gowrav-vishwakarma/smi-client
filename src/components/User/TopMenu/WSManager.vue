<template lang="pug">
    div
      v-icon(small :color="isConnected ? 'green' : 'red'") mdi-circle
      div.extra-component
        //- div.call-dial-ringing
        //-   audio(ref="callDialPlayer")
        //-     source(src="@/assets/audio/callDialTone.mp3" type="audio/mpeg")
        div.call-receive-ringing
          audio(ref="incomingCallRingingPlayer")
            source(src="@/assets/audio/callRingingTone.mp3" type="audio/mpeg" preload="auto")
</template>

<script lang="ts">
import { Component, Vue, Ref } from "vue-property-decorator";
import socket, { SocketOn, SocketEmit } from "@/services/socket";
import { SocketAuthDTO, InitiateCallDTO } from "@/dto/ws.dto";
import solutionsApi from "@/services/solutions.api";

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

  mounted() {
    this.socketConnect();
    // this.loadAudio();
    // this.playSoundWithNotification();
  }

  socketConnect() {
    if (!this.$store.getters.isAuthenticated) {
      console.log("Not connecting to socket because user is not authenticated");
      return;
    }
    const username = this.$store.getters.loggedInUser._id;

    socket.auth = { username };
    socket.connect();

    SocketOn(
      "session",
      (data: any) => {
        socket.auth = { username };
        this.isConnected = true;
      },
      SocketAuthDTO
    );
    // socket.on("session", ({ username }) => {
    //   socket.auth = { username };
    //   this.isConnected = true;
    // });

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

            /** call accepted buy offerer end user - so redirecting to solution-attempt page*/
            this.$router.push(
              "/solution-attempt/" + newPayload.solutionOfferId
            );
          } else {
            SocketEmit("denyCall", newPayload);
          }
        });
    });

    SocketOn("callAccepted", (payload) => {
      console.log("callAccepted at single offer component", payload);
      //temporary commenting condition
      // if (
      //   payload.offerId == this.offer._id &&
      //   payload.questionId == this.question._id &&
      //   (this.questionBelongsToMe || this.offerBelongsToMe)
      // ) {
      this.callReset();
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

    // socket.on("call-received", ({ from, content }) => {
    //   if (this.$store.getters.onlineStatus === "busy") {
    //     this.sendBusy();
    //     return;
    //   }
    //   this.from = content.callerName;
    //   this.offerById = content.offerById;
    //   this.offerId = content.offerId;
    //   // this.ringing = true;
    //   this.caller = content.callerId;
    //   // var audio = new Audio(this.soundurl);
    //   // audio.play();
    //   console.log("Call received from ", from, content);

    //   this.$vToastify
    //     .prompt({
    //       body: "Call received from " + content.callerName,
    //       answers: { Accept: true, Denied: false },
    //     })
    //     .then((callAccept) => {
    //       if (callAccept) this.acceptCall();
    //       else this.declineCall();
    //     });
    // });

    // socket.on("offer-placed", ({ content }) => {
    //   let message =
    //     content.offerUserName +
    //     " placed a offer on'" +
    //     content.questionTitle +
    //     "'";
    //   this.$vToastify
    //     .prompt({
    //       body: message,
    //       answers: { "Go to question": true, Close: false },
    //     })
    //     .then((gotoPage) => {
    //       if (gotoPage) {
    //         this.$router.push("/question/" + content.questionId);
    //       }
    //     });

    //   // this.offerPlaced.push(content);
    //   console.log("Offer Placed from ", content.offerUserName, content);
    // });

    socket.on("connect_error", (err) => {
      console.error(err);
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

  async playSoundWithNotification() {
    if (!this.audioBuffer) return;

    if (!this.audioContext) {
      this.audioContext = new window.AudioContext();
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = this.audioBuffer;
    source.connect(this.audioContext.destination);
    source.start(0);

    /**
     * Check if the browser supports notifications
     * 
    if (!("Notification" in window)) {
      console.error("This browser does not support notifications.");
      return;
    }
   * display browser notification
    // Request permission to show notifications
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        // Show a notification with a ringtone
        new Notification("Incoming Call", {
          icon: "path/to/your/icon.png",
          body: "You have a call.",
          vibrate: [200, 100, 200],
          // sound: "@/assets/audio/callRingingTone.mp3",
        });
      }
    });
  */

    // const context = new window.AudioContext();
    // const source = context.createBufferSource();
    // source.buffer = this.audioBuffer;
    // source.connect(context.destination);
    // this.bufferAudioPlayer = source;
    // source.start();

    // fetch(callDialTone)
    //   .then((response) => response.arrayBuffer())
    //   .then((arrayBuffer) => context.decodeAudioData(arrayBuffer))
    //   .then((audioBuffer) => {
    //     const source = context.createBufferSource();
    //     this.bufferAudioPlayer = source;
    //     source.buffer = audioBuffer;
    //     source.connect(context.destination);
    //     source.start();
    //     source.stop();
    //   });
  }
}
</script>
