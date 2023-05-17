<template lang="pug">
v-container
  v-card.mx-auto.mb-6.profileImageSection
    v-img(height="180px" style="overflow:visible;" cover :src="coverImage")
      .d-flex
        v-avatar.ml-2(color="grey" size="150" rounded="50%" style="position: absolute;bottom:-20px;")
          v-img(cover v-if="profileImage" :src="profileImage")
          v-icon(v-else style="font-size:100px;") mdi-account
        v-btn.ml-auto(icon large elevation="2" @click="editingProfileSection='uploadImage'" v-if="makeProfileEditable")
          v-icon(dark) mdi-pencil
    .d-flex.align-center.ml-auto(v-if="editingProfileSection=='uploadImage'" rounded style="width:80%")
      v-file-input(label="Cover Image" v-model="uploadCoverImage" prepend-icon="mdi-camera")
      v-file-input(label="Profile Image" v-model="uploadProfileImage" prepend-icon="mdi-camera")
      v-btn(@click="saveProfile" color="primary") save
      v-btn(@click="editingProfileSection=null,uploadCoverImage=null,uploadProfileImage=null" color="secondary" ) Reset
  v-row
    v-col.col-md-8.col-xs-12
      div.userProfile.mt-4
        v-card(flat)
          v-btn(color="primary" small icon rounted @click="editProfile=true, editingProfileSection='basicInfo'" v-if="makeProfileEditable")
            v-icon mdi-pencil
          //- v-card-title(v-if="editProfile") 
            //- v-text-field(v-model="profile.name" :hide-details="true" dense single-line :autofocus="true" v-if="editingProfileSection ==='basicInfo' ")
          v-card-title {{this.profile.name}}
            v-btn(small text)
              v-icon(color="red") mdi-map-marker
              | {{this.profile.city}} {{this.profile.state}} {{this.profile.country}}
          v-card-subtitle
            .d-flex.caption
              span(v-if="this.profile.post") {{this.profile.post}}
              span.ml-4(v-if="this.profile.companyName") {{this.profile.companyName}}
              span.ml-4(v-if="this.profile.jobType") {{this.profile.jobType}}
            span(v-if="this.profile.languagesSpeaks") {{this.profile.languagesSpeaks.join(", ")}}
          v-divider
            //- .d-flex.mt-2
            //-   div(v-if="this.profile.asFollowers") {{this.profile.asFollowers.totalFollowers}} Followers
            //-   div.ml-4(style="width:10px;")
            //-     v-divider(vertical)
            //-   div(v-if="this.profile.asFollowing") {{this.profile.asFollowing.totalFollowing}}  Connections
        v-dialog.editing-dialog(v-model="editProfile" persistent)
          v-edit-dialog(:open.sync="editProfile" @save="saveProfile" @cancel="cancelProfile")
            v-card
              v-card-title Update Profile
              v-card-text
                v-form
                  v-row
                    v-col
                      v-text-field(v-model="profile.name" label="name")
                    v-col
                      v-text-field(v-model="profile.city" label="city")
                  v-row
                    v-col
                      v-text-field(v-model="profile.state" label="state")
                    v-col
                      v-text-field(v-model="profile.country" label="country")
                  v-row
                    v-col
                      v-text-field(v-model="profile.post" label="post")
                    v-col
                      v-select(v-model="profile.jobType" label="jobType" :items="['Full Time','Part Time','Freelancer']" )
                  v-row 
                    v-col 
                      v-text-field(v-model="profile.companyName" label="companyName")
                  v-row 
                    v-col 
                      v-autocomplete(v-model="profile.languagesSpeaks" :items="languages" multiple dense small-chips label="Languages Known")
              v-card-actions
                v-spacer
                v-btn(@click="editProfile = false") Cancel
                v-btn(color="primary" @click="saveProfile") Save
      div.userSkillContainer.mt-4
        v-form(ref="userSkillForm")
          .d-flex
            h5.mb-2(class="text-h5 font-weight-regular ") Topics Interested In
            div(v-if="editingProfileSection ==='topicsInterestedIn'")
              v-btn.ml-4(small rounted icon color="success" @click="saveProfile"  v-if="editingProfileSection ==='topicsInterestedIn'")
                v-icon mdi-content-save
              v-btn.ml-4(small rounted icon color="red" @click="editingProfileSection=null,editProfile=false"  )
                v-icon mdi-delete
            div(v-else)
              v-btn.ml-4(small rounted icon color="primary" @click="editProfile=false, editingProfileSection='topicsInterestedIn'" v-if="makeProfileEditable")
                v-icon mdi-pencil
          //- v-autocomplete( v-model="profile.topicsInterestedIn" :items="skillList" label="" multiple chips :autofocus="editingProfileSection == 'topicsInterestedIn'?true:false"  v-if="editingProfileSection ==='topicsInterestedIn'")
          //-   template(v-slot:selection="{ item, index }")
          //-     v-chip(v-bind="item" close @click:close="removeSkill(item)" @click="removeSkill(item)")
          //-       | {{ item.split("/").reverse()[0] }}
          //-   template(v-slot:item="data")
          //-     v-list-item-content
          //-       v-list-item-title(v-html="data.item.split('/').map((item, index) => '&nbsp;'.repeat(index * 4) + item).join('<br/>')")
          treeselect(v-model="profile.topicsInterestedIn" :multiple="true" :options="topicsInterestedIn" placeholder="Select Topics of Interests" v-if="editingProfileSection ==='topicsInterestedIn'")
          div(v-else)
            v-card(flat v-if="profile.topicsInterestedIn && profile.topicsInterestedIn.length > 0").pa-2
              v-chip.ma-1(v-for="(value, index) in profile.topicsInterestedIn" :key="index") {{value.split("/").reverse()[0]}}
            v-card(flat v-else).pa-2
              v-card-subtitle Please update your topics of interest
          div(v-if="profile._id == $store.getters.loggedInUser._id")
            v-card 
              v-card-text(@click="copyToClipBoard" style="cursor:pointer") Your ask me link (click to copy): {{ askMeLink }}
      //- div.userExperienceContainer.mt-4
      //-   v-form(ref="userExperienceForm")
      //-     .d-flex
      //-       h5.mb-2(class="text-h5 font-weight-regular ") Experience
      //-       v-btn.ml-4(small icon color="primary" rounted @click="editingProfileSection='experience'" v-if="makeProfileEditable")
      //-         v-icon mdi-plus
      //-   div.mt-4
      //-     v-card(v-if="editingProfileSection==='experience'" color="primary" dark)
      //-         v-card-title add Experience
      //-         v-card-text
      //-           v-form
      //-             v-row
      //-               v-col
      //-                 v-text-field(v-model="newExperience.companyName" label="company name")
      //-             v-row
      //-               v-col
      //-                 v-text-field(v-model="newExperience.post" label="post")
      //-               v-col
      //-                 v-text-field(v-model="newExperience.jobType" label="job type")
      //-             v-row
      //-               v-col
      //-                 v-text-field(v-model="newExperience.from" label="Joining Date")
      //-                 v-date-picker(v-model="newExperience.from")
      //-               v-col
      //-                 v-text-field(v-model="newExperience.to" label="end Date")
      //-                 v-date-picker(v-model="newExperience.to")
      //-             v-row
      //-               v-col
      //-                 v-text-field(v-model="newExperience.city" label="city")
      //-               v-col
      //-                 v-text-field(v-model="newExperience.state" label="state")
      //-               v-col
      //-                 v-text-field(v-model="newExperience.country" label="country")
      //-             v-row
      //-               v-col
      //-                 v-textarea(v-model="newExperience.role" label="job Role")
      //-               v-col
      //-                 v-textarea(v-model="newExperience.description" label="job Description")
      //-         v-card-actions
      //-           v-spacer
      //-           v-btn(@click="editProfile = false,editingProfileSection=null") Cancel
      //-           v-btn(color="success" @click="saveProfile") Save
      //-     div(v-if="profile.experiences && profile.experiences.length")
      //-       v-card.mb-4(v-for="(experience, index) in profile.experiences" :key="index")
      //-         v-list-item.ma-0(three-line)
      //-           v-list-item-content
      //-             v-list-item-title  {{experience.companyName}}
      //-             v-list-item-subtitle {{experience.post}}
      //-               small.ml-4 . {{experience.jobType}}
      //-             v-list-item-subtitle 
      //-               .d-flex
      //-                 p {{experience.from}} - {{experience.to}}
      //-                 p.ml-auto {{experience.city}} {{experience.state}} {{experience.country}}
      //-         v-container.pa-0.ma-0(style='width="60% !important"')
      //-           v-divider
      //-         v-container
      //-           v-list-item-title Role
      //-             div(v-html="experience.role")
      //-           v-list-item-title Description
      //-             div(v-html="experience.description")
      //-         v-divider
      //-     div(v-else)
      //-       v-card(flat).pa-2.mb-4
      //-         v-card-subtitle my experience not be updated at the moment

    v-col.col-sm-12.col-md-4
      v-card.mt-4
        v-card-subtitle Rating as Questioner
        v-card-text
          User-Rating(v-if="profile.reputationAsQuestioner" :User="userAsQuestioner")
      v-card.mt-4
        v-card-subtitle Rating as Solver
        v-card-text
          User-Rating-As-Solver(v-if="profile.ratingAsSolver" :User="userAsSolver")           
      //- v-card.mt-4
      //-   v-btn.ml-4(small rounted icon color="primary" @click="editProfile=false, editingProfileSection='contact'" v-if="editingProfileSection==null && makeProfileEditable" )
      //-     v-icon mdi-pencil
      //-   v-btn.ml-4(small rounted icon color="primary" @click="saveProfile" v-if="editingProfileSection==='contact'")
      //-     v-icon mdi-content-save
      //-   v-btn.ml-4(small rounted icon color="primary" @click="editProfile=false, editingProfileSection=null" v-if="editingProfileSection==='contact'")
      //-     v-icon mdi-delete
      //-   v-list
      //-     v-list-item
      //-       v-list-item-icon
      //-         v-icon(color="indigo" small) mdi-phone
      //-       v-list-item-content(v-if="editingProfileSection=='contact'")
      //-         v-text-field(v-model="profile.contactNo" label="contact no")
      //-       v-list-item-content(v-else)
      //-         v-list-item-title {{profile.contactNo}}
      //-         v-list-item-subtitle contact No
      //-     v-divider(inset)
      //-     v-list-item
      //-       v-list-item-icon
      //-         v-icon(color="indigo" small) mdi-email
      //-       v-list-item-content
      //-         v-list-item-title {{profile.email}}
      //-         v-list-item-subtitle work
      //- v-card.mt-4
      //-   v-btn.ml-4(small text rounted color="primary" @click="editProfile=false, editingProfileSection='social'" v-if="editingProfileSection==null && makeProfileEditable")
      //-     v-icon mdi-pencil
      //-     | social link
      //-   v-btn.ml-4(small rounted icon color="primary" @click="saveProfile" v-if="editingProfileSection==='social'")
      //-     v-icon mdi-content-save
      //-   v-btn.ml-4(small rounted icon color="primary" @click="editProfile=false, editingProfileSection=null" v-if="editingProfileSection==='social'")
      //-     v-icon mdi-delete
      //-   v-list(v-if="editingProfileSection=='social'")
      //-     div(v-for="(profileId, name) in profile.socialProfile" :key="name")
      //-       v-list-item
      //-         v-list-item-icon
      //-           v-icon(color="indigo") mdi-{{name.toLowerCase()}}
      //-         v-list-item-content()
      //-           v-text-field(v-model="profile.socialProfile[name]" :label="name")
      //-   v-container.d-flex(style="flex-wrap:wrap;" v-else)
      //-     div(v-for="(profilelink, name) in profile.socialProfile" :key="name")
      //-       v-btn( target="_blank" v-if="profilelink" icon :href="profilelink")
      //-         v-icon(v-if="name=='Stackoverflow' || name=='Website' " color="indigo" large) mdi-web
      //-         v-icon(v-else color="indigo" large) mdi-{{name.toLowerCase()}}
</template>

<script lang="ts">
// import the component
import Treeselect from "@riophae/vue-treeselect";
// import the styles
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { Component, Vue, Ref, Prop } from "vue-property-decorator";
import {
  topics_,
  topics,
  getFlatTopics,
  languages,
  Topic,
} from "@/services/staticValues";
import userExperience from "../../dto/user/experience.dto";
// import profileDto from "../../dto/user/profile.dto";
// import QuestionerSignature from "@/components/User/Signature/AsQuestioner.vue";
import UserRating from "@/components/User/Rating.vue";
import UserApiService from "@/services/user.api";
import UserRatingAsSolver from "@/components/User/RatingAsSolver.vue";
import { eventBus } from "@/mixins/event-bus";

@Component({
  name: "UserProfile",
  components: {
    UserRating,
    // QuestionerSignature,
    UserRatingAsSolver,
    Treeselect,
  },
})
export default class UserProfileComponent extends Vue {
  @Ref() userSkillForm!: HTMLFormElement;

  @Prop()
  createProfileEditable!: false;

  get makeProfileEditable() {
    return this.createProfileEditable;
  }

  //Editing Form
  editProfile = false;
  editingProfileSection: string | null = null;
  uploadCoverImage: File | null = null;
  uploadProfileImage: File | null = null;

  skillList: string[] = getFlatTopics(topics_);
  topicsInterestedIn: Topic[] = topics;
  languages: string[] = languages;

  newExperience = {
    companyName: null,
    post: null,
    from: null,
    to: null,
    city: null,
    state: null,
    country: null,
    jobType: null,
    role: null,
    description: null,
  };
  userExperienceList: userExperience[] = [];

  profile: any = {};

  get userAsQuestioner() {
    return {
      reputationAsQuestioner: this.profile.reputationAsQuestioner,
    };
  }
  get userAsSolver() {
    return {
      ratingAsSolver: this.profile.ratingAsSolver,
    };
  }

  get coverImage() {
    if (this.uploadCoverImage)
      return URL.createObjectURL(this.uploadCoverImage);
    else
      return this.profile.coverImage
        ? process.env.VUE_APP_S3_CDN_URL + this.profile.coverImage
        : "https://cdn.vuetifyjs.com/images/cards/server-room.jpg";
  }

  get profileImage() {
    if (this.uploadProfileImage)
      return URL.createObjectURL(this.uploadProfileImage);
    else
      return this.profile.profileImage
        ? process.env.VUE_APP_S3_CDN_URL + this.profile.profileImage
        : "";
    // : "https://cdn.vuetifyjs.com/images/profiles/marcus.jpg";
  }

  // get askMeLink() {
  //   return (
  //     process.env.VUE_APP_BASE_URL +
  //     "/ask-question?to=" +
  //     this.$store.getters.loggedInUser._id
  //   );
  // }

  get askMeLink() {
    return (
      "https://solvemyissue.online/ask-question?to=" +
      this.$store.getters.loggedInUser._id
    );
  }

  copyToClipBoard() {
    const clipboardData =
      navigator.clipboard ||
      window.Clipboard; /* IE support https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript */
    const message = this.askMeLink;

    clipboardData.writeText(message);
    this.$vToastify.success("Copied to clipboard");
  }

  async mounted() {
    this.profile = await UserApiService.getProfile(
      this.makeProfileEditable
        ? this.$store.getters.loggedInUser._id
        : this.$route.params.userId
    );
    if (!this.profile.experiences) {
      this.profile["experiences"] = this.userExperienceList;
    }
  }

  removeSkill(skill: string) {
    this.profile.topicsInterestedIn.splice(
      this.profile.topicsInterestedIn.indexOf(skill),
      1
    );
  }

  async saveProfile() {
    this.editProfile = false;

    let postData: any;
    switch (this.editingProfileSection) {
      case "basicInfo":
        postData = {
          userId: this.$store.getters.loggedInUser._id,
          name: this.profile.name,
          city: this.profile.city,
          state: this.profile.state,
          country: this.profile.country,
          post: this.profile.post,
          jobType: this.profile.jobType,
          companyName: this.profile.companyName,
          languagesSpeaks: this.profile.languagesSpeaks,
        };
        break;
      case "topicsInterestedIn":
        postData = {
          userId: this.$store.getters.loggedInUser._id,
          topicsInterestedIn: this.profile.topicsInterestedIn,
        };
        break;
      case "experience":
        if (this.profile && !this.profile.experiences) {
          this.profile["experiences"] = [];
        }
        this.profile.experiences.push(this.newExperience);
        postData = {
          userId: this.$store.getters.loggedInUser._id,
          experiences: this.profile.experiences,
        };
        break;

      case "social":
        postData = {
          userId: this.$store.getters.loggedInUser._id,
          socialProfile: this.profile.socialProfile,
        };
        break;

      case "contact":
        postData = {
          userId: this.$store.getters.loggedInUser._id,
          contactNo: this.profile.contactNo,
        };
        break;
      case "uploadImage":
        postData = {
          userId: this.$store.getters.loggedInUser._id,
        };
        if (!this.uploadCoverImage && !this.uploadProfileImage) postData = null;
        break;
      default:
        postData = {
          userId: this.$store.getters.loggedInUser._id,
        };
        break;
    }

    if (!postData) return;

    eventBus.$emit("show-loader");

    console.log("postData", postData);

    await UserApiService.updateProfile(
      postData,
      this.uploadCoverImage,
      this.uploadProfileImage
    )
      .then((res) => {
        console.log("response after saved", res);
      })
      .catch((err: any) => {
        if (err.response?.status === 401) {
          console.log("Username or password is incorrect");
        } else {
          console.log(err);
        }
      });
    eventBus.$emit("hide-loader");

    this.editingProfileSection = null;
  }

  cancelProfile() {
    console.log("cancel profile methods");
    this.editProfile = false;
  }
}
</script>

<style>
.v-dialog {
  width: auto;
}
</style>
