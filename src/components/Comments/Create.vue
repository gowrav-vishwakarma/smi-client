<template lang="pug">
div
  v-card.d-flex.flex-column(tile)
      v-card-text Your answer/comment
        vue-editor.mt-2(v-model="comment" :editor-toolbar="editorToolbar")
      v-card-actions.pl-3.pr-3
        v-btn(block v-if="this.$store.getters.loggedInUser" @click="submitComment" color="primary") Submit Answer
        v-btn(v-else block color="secondary" @click="redirectToLogin" ) Login to Answer
</template>

<script lang="ts">
import "reflect-metadata";
import { Component, Prop, Vue } from "vue-property-decorator";
import { VueEditor } from "vue2-editor";
import commentsAPIService from "@/services/comments.api";
import { AuthStoreModule } from "@/store";

@Component({
  name: "CreateCommentComponent",
  components: {
    VueEditor,
  },
})
export default class CreateCommentComponent extends Vue {
  @Prop({ default: null })
  readonly question!: any;

  comment = "";

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
  submitComment() {
    commentsAPIService
      .createComment(this.question._id, this.comment)
      .then((res) => {
        AuthStoreModule.setDraftFormAction(null);
        // console.log(res);
        this.comment = "";
        this.$emit("event-new-comment-created");
      });
  }

  redirectToLogin() {
    if (!this.$store.getters.isAuthenticated) {
      // todo store value into store
      AuthStoreModule.setDraftFormAction({
        path: this.$route.path,
        formName: "QuestionAnswerForm",
        formData: {
          questionId: this.question._id,
          comment: this.comment,
        },
      });

      this.$store.commit("setLoginSuccessRedirectUrl", this.$route.path);
      this.$router.push("/login");
    }
  }

  mounted() {
    if (
      AuthStoreModule.draftQuestionAnswerForm &&
      AuthStoreModule.draftQuestionAnswerForm.path == this.$route.path &&
      AuthStoreModule.draftQuestionAnswerForm.formData.questionId ==
        this.question._id
    ) {
      this.comment = AuthStoreModule.draftQuestionAnswerForm.formData.comment;
    }
  }
}
</script>
