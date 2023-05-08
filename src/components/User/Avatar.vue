<template>
  <div>
    <!-- show img if user.img is available or show vue-garvatar with users email as prrop-->
    <!-- <p>{{ user }} {{ user.profileImage }}</p> -->
    <img
      v-if="user && user.profileImage"
      :src="profileImageUrl"
      alt="avatar"
      class="avatar"
      max-height="30"
      max-width="30"
    />
    <gravatar
      v-else
      :email="user && user.email"
      :size="SIZE"
      :default="'identicon'"
    ></gravatar>
  </div>
</template>

<script>
import Gravatar from "vue-gravatar";

export default {
  name: "UserAvatar",
  props: {
    user: {
      type: Object,
      required: true,
    },
    SIZE: {
      type: Number,
      default: 45,
    },
  },
  components: {
    Gravatar,
  },

  data() {
    return {
      profileImageUrl:
        this.user && this.user.profileImage
          ? process.env.VUE_APP_S3_CDN_URL + this.user.profileImage
          : "https://cdn.vuetifyjs.com/images/profiles/marcus.jpg",
    };
  },
};
</script>
