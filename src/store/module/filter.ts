import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";

export class FiltersI {
  query?: string;
  topics?: string[];
  tags?: string[];
  languages?: string[];
  sortBy?: string;
  hasComments?: boolean;
  availableOnChatChannel?: boolean;
  availableOnScreenShare?: boolean;
  availableOnVideoCall?: boolean;
  availableOnAudioCall?: boolean;
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
      : {
          query: "",
          topics: [],
          tags: [],
          languages: [],
          sortBy: "newest",
          availableOnChatChannel: true,
          availableOnScreenShare: true,
          availableOnVideoCall: true,
          availableOnAudioCall: true,
        };
  }

  get isCleared(): boolean {
    return (
      this.filterState === null ||
      (this.filterState?.query == "" &&
        this.filterState?.topics?.length == 0 &&
        this.filterState?.tags?.length == 0 &&
        this.filterState?.languages?.length == 0 &&
        this.filterState?.sortBy == "newest")
    );
  }

  @Mutation
  setFilters(filters: FiltersI) {
    this.filterState = filters;
  }
}
