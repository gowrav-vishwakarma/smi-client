<template lang="pug">
div.text-center.voting-component.d-flex.flex-column
  .d-flex
      div
        v-tooltip(top)
          template( v-slot:activator="{ on, attrs }")
            v-icon.mx-2(small @click="voteUp" v-bind="attrs" v-on="on" :color="voteUpColor") mdi-thumb-up
            p.pa-0.ma-0.icon-text {{ currentVoteUpCount }} up 
          span vote up
      div
        v-tooltip(top)
          template( v-slot:activator="{ on, attrs }")
            v-icon.mx-2(small @click="voteDown" v-bind="attrs" v-on="on" :color="voteDownColor") mdi-thumb-down
            p.pa-0.ma-0.icon-text {{ currentVoteDownCount }} down
          span vote dowm
  slot
  auth-dialog(:showDialog.sync="AuthDialogState")
</template>

<script lang="ts">
import QuestionListResponseDTO from "@/dto/response/question-list-response.dto";
import CommentListResponseDTO from "@/dto/response/comment-list-response.dto";
import commentsApi from "@/services/comments.api";
import questionsApi from "@/services/questions.api";
import { Component, Prop, Vue } from "vue-property-decorator";
import AuthDialog from "@/components/User/AuthDialog.vue";
import { nextTick } from "vue/types/umd";

@Component({
  name: "VotingComponent",
  components: {
    AuthDialog,
  },
})
export default class VoteingComponent extends Vue {
  @Prop({ default: null })
  readonly question!: QuestionListResponseDTO;

  @Prop({ default: null })
  comment!: CommentListResponseDTO;

  AuthDialogState = false;

  get currentVoteUpCount() {
    if (this.question) {
      return this.question.questionValue.totalVoteCount;
    } else {
      return this.comment.commentValue.totalVoteCount;
    }
  }

  get currentVoteDownCount() {
    if (this.question) {
      return this.question.questionValue.totalVoteDownCount;
    } else {
      return this.comment.commentValue.totalVoteDownCount;
    }
  }

  // get myVote() {
  //   if (this.question) {
  //     return this.question.myVote;
  //   } else {
  //     return this.comment.myVote;
  //   }
  // }

  get voteUpColor() {
    if (this.question) {
      if (this.question.myVote && this.question.myVote.vote == 1) {
        return "primary";
      } else {
        return "";
      }
    } else {
      // else for comment
      // console.log("this.comment.myVote", this.comment.myVote);
      if (this.comment.myVote && this.comment.myVote.vote == 1) {
        return "primary";
      } else {
        return "";
      }
    }
    // if (this.myVote && this.myVote.vote == 1) {
    //   return "primary";
    // } else {
    //   return "";
    // }
  }

  get voteDownColor() {
    if (this.question) {
      if (this.question.myVote && this.question.myVote.vote == -1) {
        return "red";
      } else {
        return "";
      }
    } else {
      // else for comment
      if (this.comment.myVote && this.comment.myVote.vote == -1) {
        return "red";
      } else {
        return "";
      }
    }
  }

  voteUp() {
    if (!this.$store.getters.isAuthenticated) {
      this.AuthDialogState = true;
      return;
    }

    if (this.question) {
      this.voteUpQuestion();
    } else {
      this.voteUpComment();
    }
  }

  voteDown() {
    if (!this.$store.getters.isAuthenticated) {
      this.AuthDialogState = true;
      return;
    }

    if (this.question) {
      this.voteDownQuestion();
    } else {
      this.voteDownComment();
    }
  }

  voteUpQuestion() {
    /** todo
     * 1 check login condition
     *    false then redirect to login page
     * 2 question is not created by self
     */

    if (!this.$store.getters.isAuthenticated) {
      this.AuthDialogState = true;
      return;
    }

    questionsApi.vote(this.question._id, "up").then((res) => {
      // checking if new vote or changing from up to down or viseversa
      if ((res.matchedCount && res.modifiedCount) || res.upsertedId) {
        this.question.questionValue.totalVoteCount++;
        if (!this.question.myVote) {
          this.$set(this.question, "myVote", { vote: 1 });
        } else {
          this.question.myVote.vote = 1;
        }
        if (res.matchedCount && res.modifiedCount) {
          this.question.questionValue.totalVoteDownCount--;
        }
      }
    });
  }

  voteDownQuestion() {
    if (!this.$store.getters.isAuthenticated) {
      this.AuthDialogState = true;
      return;
    }

    questionsApi.vote(this.question._id, "down").then((res) => {
      if ((res.matchedCount && res.modifiedCount) || res.upsertedId) {
        if (res.matchedCount && res.modifiedCount) {
          this.question.questionValue.totalVoteCount--;
        }
        this.question.questionValue.totalVoteDownCount++;
        if (!this.question.myVote) {
          this.$set(this.question, "myVote", { vote: -1 });
        } else {
          this.question.myVote.vote = -1;
        }
      }
    });
  }

  voteUpComment() {
    if (!this.$store.getters.isAuthenticated) {
      this.AuthDialogState = true;
      return;
    }

    commentsApi.vote(this.comment._id, "up").then((res) => {
      if ((res.matchedCount && res.modifiedCount) || res.upsertedId) {
        if (res.matchedCount && res.modifiedCount) {
          this.comment.commentValue.totalVoteDownCount--;
        }
        this.comment.commentValue.totalVoteCount++;
        if (!this.comment.myVote) {
          this.$set(this.comment, "myVote", { vote: 1 });
        } else {
          this.comment.myVote.vote = 1;
        }
        // this.comment.myVote.vote = 1;
      }
    });
  }

  voteDownComment() {
    if (!this.$store.getters.isAuthenticated) {
      this.AuthDialogState = true;
      return;
    }

    commentsApi.vote(this.comment._id, "down").then((res) => {
      if ((res.matchedCount && res.modifiedCount) || res.upsertedId) {
        if (res.matchedCount && res.modifiedCount) {
          this.comment.commentValue.totalVoteCount--;
        }
        this.comment.commentValue.totalVoteDownCount++;
        if (!this.comment.myVote) {
          this.$set(this.comment, "myVote", { vote: -1 });
        } else {
          this.comment.myVote.vote = -1;
        }
      }
    });
  }

  // mounted() {
  //   if (this.comment && this.comment.myVote == undefined) {
  //     this.comment["myVote"] = {
  //       vote: 0,
  //     };
  //   }
  // }
}
</script>

<style scoped>
.voting-component .icon-text {
  font-size: 0.6em;
}
</style>
