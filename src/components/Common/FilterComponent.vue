<template lang="pug">
    div.filter-component
      .d-flex(style="align-items:center;" rounded)
        v-text-field.filter-component-input(placeholder="search query" @click:append.prevent="filterFormDialog=true"	 @keydown.enter.prevent="setQueryFilter" v-model="queryString" class="white--text" prepend-inner-icon="mdi-magnify" append-icon="mdi-filter-multiple" hide-details="auto" clearable filled rounded @click:clear="clearFilter")
          <template v-slot:append-outer v-if="isFilterSelected">
            v-chip(small color="primary") {{isFilterSelected}} Filter
          </template>
      v-dialog(v-model="filterFormDialog" width="600")
        v-card.pa-4
          Question-Filters(:callback="setFilter")
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { eventBus } from "@/mixins/event-bus";
import QuestionFilters from "@/components/Question/FilterForm.vue";
import { FilterQuestionsDTO } from "@/dto/request/question-filter.dto";

@Component({
  name: "FilterComponent",
  components: {
    QuestionFilters,
  },
})
export default class FilterComponent extends Vue {
  queryString: any = null;
  filterFormDialog = false;
  /**
   * todo
   *  type n enter search into question title & tags
   *
   */
  setFilter(filters: FilterQuestionsDTO) {
    // if (this.queryString) {
    //   let filter = {
    //     query: this.queryString,
    //   };
    //   this.$store.commit("setFilters", filter);
    //   eventBus.$emit("filterQuestions", filter);
    // } else
    
    if (filters != undefined) {
      this.queryString = filters.query;
      console.log("filters",filters);
      this.$store.commit("setFilters", filters);
      eventBus.$emit("filterQuestions", filters);
    }

    this.filterFormDialog = false;
  }

  clearFilter(){
    this.queryString = undefined;
    this.$store.commit("setFilters", undefined);
    eventBus.$emit("filterQuestions", undefined);
  }

  setQueryFilter(){
    this.setFilter(
      {
        query:this.queryString
      }
    )
  }

  
  get isFilterSelected() {
    let found = 0;
    if (this.$store.getters.filters) {
      for (const a in this.$store.getters.filters) {
        if (
          this.$store.getters.filters[a] != null &&
          this.$store.getters.filters[a].length > 0
        ) {
          found += 1;
        }
      }

      found += (
      this.$store.getters.filters.availableOnAudioCall ||
      this.$store.getters.filters.availableOnVideoCall ||
      this.$store.getters.filters.availableOnScreenShare
    )?1:0
      return found;
    }
    return found;
  }

  mounted(){
    if(this.$store.getters.filters){
      this.queryString = this.$store.getters.filters.query;
    }
  }
}
</script>

<style scoped>
.filter-component-input{
  background-color: #f1f1f1;
  border-radius:28px !important;
}
</style>
