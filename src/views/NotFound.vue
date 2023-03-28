<template lang="pug">
  v-container(style="width: 100%; max-width: 100%")
    p Not Found
</template>

<script lang="ts">
import QuestionList from "@/components/Question/List.vue";
import TopicList from "@/components/Topic/List.vue";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {
    QuestionList,
    TopicList,
  },
})
export default class HomeView extends Vue {}
</script>
