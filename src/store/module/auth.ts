import { validatorDto } from "@/helper/validateDto";
import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule,
} from "vuex-module-decorators";

export class CurrentUserI {
  _id!: string;
  email!: string;
  name!: string;
  accessToken!: string;
  userToppics!: string[];
  userLanguages!: string[];
  onlineStatus: string | null = null;
}

export interface IAuthState {
  currentUser: CurrentUserI | null;
}

@Module({ name: "auth" })
export default class Auth extends VuexModule implements IAuthState {
  currentUser: CurrentUserI | null = null;

  get token(): string | undefined {
    return this.currentUser?.accessToken;
  }

  get isAuthenticated(): boolean {
    return this.currentUser !== null && this.currentUser?.accessToken !== null;
  }

  get loggedInUser(): CurrentUserI | null {
    return this.currentUser ?? null;
  }

  get userOnlineStatus(): string | null {
    return this.currentUser?.onlineStatus ?? null;
  }

  @Mutation
  setCurrentUser(currentUser: CurrentUserI) {
    this.currentUser = currentUser;
  }

  @Mutation
  updateUserOnlineStatus(onlineStatus: string) {
    if (this.currentUser) this.currentUser["onlineStatus"] = onlineStatus;
  }

  @Action
  async setCurrentUserAction(currentUser: CurrentUserI) {
    this.context.commit(
      "setCurrentUser",
      await validatorDto(CurrentUserI, { ...currentUser })
    );
  }

  @Action
  async resetCurrentUserAction() {
    await this.context.commit("setCurrentUser", null);
  }

  @Action
  async updateUserOnlineStatusAction(status: string | null) {
    await this.context.commit("updateUserOnlineStatus", status);
  }
}
