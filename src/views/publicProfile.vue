<template lang="pug">
    v-container(grid-list-xs="")
        ProfileComponent
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import ProfileComponent from "@/components/User/Profile.vue";

@Component({
  components: {
    ProfileComponent,
  },
})
export default class publicProfileView extends Vue {}
</script>
