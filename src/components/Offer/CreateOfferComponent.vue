<template lang="pug">
div
  v-card.pa-2(v-if="!myOffer")
    v-card-title(v-if="showTitle") Offer Your Solution
    v-form(ref="createOfferForm" v-model="offerFormValid" @submit.prevent="createOffer")
      v-textarea(v-model="offerFormData.offerAnswerDesc" label="Offer Answer" required outlined auto-grow rows="3" :rules="descRules")
      div
        v-label In which form would you be comfortable in answering the question?
        .d-flex.justify-space-between
          v-switch(v-model="offerFormData.solutionChannelMode" color="primary" label="Chat" value="Chat")
          v-switch(v-model="offerFormData.solutionChannelMode" color="primary" label="Video" value="Video")
        .d-flex
          v-switch(v-model="offerFormData.solutionChannelMode" color="primary" label="Screen Share" value="ScreenShare")
        //- v-alert(border="top" color="red lighten-2" dark v-if="!offerFormData.solutionChannelMode.length") | Please Select at least one mode
      v-btn(color="primary" block rounded :disabled="myOffer" type="submit"  :loading="loading"	) {{caption}}
  v-card(v-else  :disabled="myOffer" )
    v-card-title {{caption}}, please wait
  auth-dialog(:showDialog.sync="AuthDialogState")
  //- v-snackbar(v-model="snackbar" :color="snackbarColor" absolute	 :timeout="snackbarTimeout") {{snackbarMessage}}
</template>

<script lang="ts">
import questionsApi from "@/services/questions.api";
import "reflect-metadata";
import { Component, Prop, Vue, Ref } from "vue-property-decorator";
import AuthDialog from "@/components/User/AuthDialog.vue";
import { AuthStoreModule } from "@/store";
import { eventBus } from "@/mixins/event-bus";

@Component({
  name: "CreateOfferSolutionComponent",
  components: {
    AuthDialog,
  },
})
export default class CreateOfferSolutionComponent extends Vue {
  @Ref("createOfferForm") private createOfferForm!: HTMLFormElement;

  descRules = [(v: string) => !!v || "Description is required"];

  @Prop({ default: null })
  readonly question!: any;

  @Prop({ default: true })
  readonly showTitle!: boolean;

  AuthDialogState = false;

  offerFormValid = false;
  offerFormData = {
    offerAnswerDesc: null,
    solutionChannelMode: ["Chat", "Video", "ScreenShare"],
  };

  // snackbar = false;
  // snackbarColor = "success";
  // snackbarMessage = "your offer submitted";
  // snackbarTimeout = "1000";
  // offerCreated = false;
  loading = false;

  async createOffer() {
    this.loading = true;
    let isFormValid = this.createOfferForm.validate();
    // let xyz = this.createOfferForm.validate();
    // console.log(xyz);
    if (!this.$store.getters.isAuthenticated) {
      // todo store value into store
      AuthStoreModule.setDraftFormAction({
        path: this.$route.path,
        formName: "OfferYourSolution",
        formData: this.offerFormData,
      });
      this.$store.commit("setLoginSuccessRedirectUrl", this.$route.path);
      this.AuthDialogState = true;
      this.loading = false;
      return;
    }

    if (
      isFormValid &&
      this.$store.getters.loggedInUser &&
      this.$store.getters.loggedInUser._id
    ) {
      if (this.question.myOffer) {
        alert("You have already offered your solution");
        return;
      }
      await questionsApi
        .createOffer(
          this.question.questionerId,
          this.question._id,
          this.offerFormData.offerAnswerDesc
            ? this.offerFormData.offerAnswerDesc
            : "Interested",
          this.offerFormData.solutionChannelMode
        )
        .then((res) => {
          eventBus.$emit("offer-submitted");
          AuthStoreModule.setDraftFormAction(null);
          this.createOfferForm.reset();
        })
        .catch((err) => {
          console.log(err);
        });

      //
    }

    this.loading = false;
  }

  get myOffer() {
    return this.question.myOffer ? true : false;
  }

  get caption() {
    return this.question.myOffer ? "Already offered" : "Offer your solution";
  }

  mounted() {
    if (
      AuthStoreModule.draftOfferYourSolution &&
      AuthStoreModule.draftOfferYourSolution.path == this.$route.path
    ) {
      // console.log(
      //   "AuthStoreModule.draftOfferYourSolution",
      //   AuthStoreModule.draftOfferYourSolution
      // );
      this.offerFormData = AuthStoreModule.draftOfferYourSolution.formData;
    }
  }
}
</script>
