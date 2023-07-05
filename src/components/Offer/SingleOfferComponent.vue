<template lang="pug">
v-card
  .d-flex.flex-column
    //- v-alert(border="left" icon="mdi-fire" dense type="success" colored-border color="deep-purple accent-4")
    SolverSignature(:User="offer.Offerer" enableRating="true" disableFollow="true" :solverOnlineStatus="solverOnlineStatus" displayOnlineLayout="true")
    v-card-text {{offer.notes}}
      v-chip-group(v-if="offer.solutionChannel && offer.solutionChannel.length" column)
        //- div(small v-if="offer.solutionChannel && offer.solutionChannel.length")
        v-chip(small v-if="offer.solutionChannel.includes('Chat')")
          v-icon(small class="icon mr-2" color="green" ) mdi-chat
        v-chip(small v-if="offer.solutionChannel.includes('ScreenShare')")
          v-icon(small  color="green" class="mr-2") mdi-monitor
        v-chip(small v-if="offer.solutionChannel.includes('Video')")
          v-icon(small color="green" class="mr-2" ) mdi-video
        v-chip(small v-if="offer.solutionChannel.includes('Record')" tooltip="Record") Will record
          v-icon(small color="red" class="mr-2" ) mdi-record

    div(v-if="!isSolved" style="width:100%;")
      div(v-if="questionBelongsToMe" style="width:100%;")
        v-btn(blocked @click="call" v-if="questionBelongsToMe && !offerCallConnected && solverOnlineStatus" style="width:100%;")
          v-icon(small) mdi-phone
          | connect
        v-btn(blocked v-else-if="questionBelongsToMe && offerCallConnected" style="width:100%;")
          v-icon(small) mdi-phone
          | connected
        v-btn(blocked v-else-if="questionBelongsToMe" style="width:100%;")
          v-icon(small color="red") mdi-circle
          | offline
      div(v-else-if="offerBelongsToMe")
        div( v-if="offer.offerValue.totalAcceptedCount")
          v-btn( color="green lighten-4" block) {{offer.offerValue.totalAcceptedCount}} Accepted
        v-btn( v-else color="red lighten-4" block) waiting for call
      v-icon(@click="callDisconnect" v-if="offerCallConnected") mdi-phone-cancel

  v-card( v-if="offerCallConnected")
    div
      v-list-item(two-line)
        v-list-item-content
          v-list-item-title
            v-icon mdi-signal
            | Voice Connected
          v-list-item-subtitle {{offer.Offerer.name}}
    //- MulticorderUI( ref="MulticoderUI" @recorderOndataavailable="recorderOndataavailable" @delete-recording="deleteRecording" )
    .d-flex
      //- v-btn-toggle(group block)
      v-btn(text style="width:50%")
        v-icon mdi-video-box
      v-btn(text style="width:50%")
        v-icon mdi-monitor-share
  div.extra-component
    div.call-dial-ringing
      audio(ref="callDialPlayer" loop)
        source(src="@/assets/audio/callDialTone.mp3" type="audio/mpeg")
    div.call-receive-ringing
      audio(ref="callRingingPlayer" loop)
        source(src="@/assets/audio/callRingingTone.mp3" type="audio/mpeg")
</template>

<script lang="ts">
import { SocketEmit, SocketOn } from "@/services/socket";
import "reflect-metadata";
import { Component, Prop, Vue, Ref } from "vue-property-decorator";
// import MulticorderUI from "@/components/Multicorder/MulticorderUI.vue";
// import videocall from "@/components/Multicorder/videocall.vue";
import SolverSignature from "@/components/User/Signature/AsSolver.vue";

@Component({
  name: "SingleOfferComponent",
  components: {
    // MulticorderUI,
    // videocall,
    SolverSignature,
  },
})
export default class SingleOfferComponent extends Vue {
  @Ref() callRingingPlayer!: HTMLAudioElement;
  @Ref() callDialPlayer!: HTMLAudioElement;

  @Prop({ default: null })
  readonly offer!: any;

  @Prop({ default: null })
  readonly question!: any;

  @Prop({ default: null })
  readonly solverOnlineStatusList!: string[];

  @Prop({ default: false }) readonly isSolved!: boolean;

  blob = null;
  callRinging = false;

  recorderOndataavailable(blob: any) {
    this.blob = blob;
    console.log("recorded data blob", blob);
  }

  deleteRecording(index: number) {
    if (index === 0) this.blob = null;
  }

  get offerBelongsToMe() {
    return this.$store.getters.loggedInUser
      ? this.offer.offererId == this.$store.getters.loggedInUser._id
      : false;
  }

  get solverOnlineStatus() {
    return this.solverOnlineStatusList.includes(this.offer.offererId);
  }
  //toMe here logged in user
  get questionBelongsToMe() {
    return this.$store.getters.loggedInUser
      ? this.offer.questionerId == this.$store.getters.loggedInUser._id
      : false;
  }

  offerCallConnected = false;

  callRingingToastId!: any;

  mounted() {
    SocketOn("callDenied", (payload) => {
      this.callRinging = false;
      this.callReset();
      this.$vToastify.error(`by ${this.offer.Offerer.name}`, "Call Decliened");
    });

    /**
     * moved this code to ws-manager


    SocketOn("callAccepted", (payload) => {
      console.log("callAccepted at single offer component", payload);
      if (
        payload.offerId == this.offer._id &&
        payload.questionId == this.question._id &&
        (this.questionBelongsToMe || this.offerBelongsToMe)
      ) {
        // console.log("this.callRingingToastId", this.callRingingToastId);
        // this.$vToastify.removeToast(this.callRingingToastId);
        //todo remove specific toast based on id
        // temp removing all toast
        this.callReset();
        this.offerCallConnected = true;
        this.$router.push("/solution-attempt/" + payload.solutionOfferId);
      }
    });

      SocketOn("callDisconnected", (payload) => {
      this.callReset();
      console.log("callDisconnected", payload);
    });

    */
  }

  callReset() {
    this.$vToastify.removeToast();
    // this.callRingingPlayer.pause();
    // this.callDialPlayer.pause();
  }

  call() {
    // this.callRingingPlayer.play();
    // to do check user is online or not
    // to do set time duration also for 3 min

    if (this.callRinging) {
      return;
    }

    this.callRinging = true;
    this.$vToastify
      .prompt({
        title: `calling ${this.offer.Offerer.name}`,
        body: `ringing ...`,
        answers: { Disconnect: true },
      })
      .then((hangup: boolean) => {
        console.log(hangup);
        if (hangup) {
          this.callRinging = false;
          SocketEmit("hangupCall", {
            to: this.offer.Offerer._id,
            from: this.$store.getters.loggedInUser,
            offerer: this.offer.Offerer,
            questionId: this.question._id,
            questionTitle: this.question.title,
            offerId: this.offer._id,
            eventDetail: {
              name: "HangupCall",
              for: "Offer",
            },
          });
        }
      });

    SocketEmit("initiateCall", {
      to: this.offer.Offerer._id,
      from: this.$store.getters.loggedInUser,
      offerer: this.offer.Offerer,
      questionId: this.question._id,
      questionTitle: this.question.title,
      offerId: this.offer._id,
      eventDetail: {
        name: "OfferInitiateCall",
        for: "Offer",
      },
    });
  }

  callDisconnect() {
    this.callReset();
    this.offerCallConnected = false;
    SocketEmit("disconnectCall", {
      to: this.offerBelongsToMe
        ? this.$store.getters.loggedInUser
        : this.offer.Offerer._id,
      from: this.$store.getters.loggedInUser,
      offerer: this.offer.Offerer,
      questionId: this.question._id,
      questionTitle: this.question.title,
      offerId: this.offer._id,
      eventDetail: {
        name: "OfferDisconnectCall",
        for: "Offer",
      },
    });
  }
}
</script>
