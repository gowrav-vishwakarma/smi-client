import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";

export class FiltersI {
  query?: string;
  topics?: string[];
  tags?: string[];
  languages?: string[];
  sortBy?: string;
}

export interface IFilterState {
  filterState: FiltersI | null;
}

@Module({ name: "filter" })
export default class Filter extends VuexModule implements IFilterState {
  filterState: FiltersI | null = null;

  get filters(): FiltersI | null {
    return this.filterState
      ? this.filterState
      : { query: "", topics: [], tags: [], languages: [], sortBy: "newest" };
  }

  @Mutation
  setFilters(filters: FiltersI) {
    this.filterState = filters;
  }
}
