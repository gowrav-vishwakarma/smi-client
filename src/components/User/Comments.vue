<template lang="pug">
div(style="width: 100%") 
  div(v-if="comments.length > 0" style="width: 100%")
    v-card.d-flex.flex-column.mb-2.pa-2(v-for="(comment,i) in comments" :key="i")
      h4.blue--text(@click="gotoDetails(comment.questionId._id)" style="cursor:pointer") Q: {{ comment.questionId.title }}
      .caption(v-html="comment.questionId.detail")
      v-divider
      .caption <b>My Comment:</b> {{ shortdetail(comment.comment) }}
      small.d-flex.justify-space-between
        .caption.ml-auto.grey--text.lighten-4 commented {{ humanized_time_span(comment.createdAt) }}
        v-btn.ml-2.white--text(x-small color="red" @click="deleteComment(comment._id)") Delete
  v-card(v-else)
    v-card-text You have not made any comments yet, Start helping others
    
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { General } from "@/mixins/general";
import userApi from "@/services/user.api";
import S from "string";
import commentsApi from "@/services/comments.api";

@Component({
  name: "UserComments",
})
export default class UserCommentsComponent extends Mixins(General) {
  comments: any[] = [];

  async mounted() {
    this.comments = await userApi.getMyComments();
    console.log(this.comments);
  }

  gotoDetails(questionId: string) {
    this.$router.push("question/" + questionId);
  }

  deleteComment(id: string) {
    const confirmed = confirm("Are you sure you want to delete this comment?");
    if (confirmed) {
      commentsApi.deleteComment(id);
      this.comments = this.comments.filter((comment) => comment._id !== id);
    }
  }

  shortdetail(detail: string) {
    return S(detail).stripTags().truncate(100).s;
  }
}
</script>
