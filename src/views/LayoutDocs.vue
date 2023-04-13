<template>
  <!-- <v-app> -->
  <div>
    <v-navigation-drawer permanent :style="{ height: windowHeight + 'px' }">
      <v-list>
        <v-list-item v-for="item in items" :key="item.title">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <p>Content goes here</p>
    </v-content>
    <!-- </v-app> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      windowHeight: window.innerHeight,
      items: [
        { title: "Item 1" },
        { title: "Item 2" },
        { title: "Item 3" },
        { title: "Item 4" },
        { title: "Item 5" },
        { title: "Item 6" },
        { title: "Item 7" },
        { title: "Item 8" },
        { title: "Item 9" },
        { title: "Item 10" },
        { title: "Item 11" },
        { title: "Item 12" },
        { title: "Item 13" },
        { title: "Item 14" },
        { title: "Item 15" },
      ],
    };
  },
  mounted() {
    window.addEventListener("resize", this.getWindowHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getWindowHeight);
  },
  methods: {
    getWindowHeight() {
      this.windowHeight = window.innerHeight;
    },
  },
};
</script>
