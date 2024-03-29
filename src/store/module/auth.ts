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
  onlineStatus: "ONLINE" | "OFFLINE" | "BUSY" = "ONLINE";
}

// storing form data that is required authentication for submission
export class draftActionFormI {
  path: string | null = null;
  formName: string | null = null;
  formData: any;
}

export interface IAuthState {
  currentUser: CurrentUserI | null;
}

@Module({ name: "auth" })
export default class Auth extends VuexModule implements IAuthState {
  currentUser: CurrentUserI | null = null;
  loginSuccessRedirectUrl: string | null = null;
  draftActionForm: draftActionFormI | null = null;

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

  get draftFormData(): draftActionFormI | null {
    return this.draftActionForm;
  }

  get draftOfferYourSolution(): draftActionFormI | null {
    if (
      this.draftActionForm &&
      this.draftActionForm.formName == "OfferYourSolution"
    ) {
      return this.draftActionForm;
    }
    return null;
  }

  get draftQuestionAnswerForm(): draftActionFormI | null {
    if (
      this.draftActionForm &&
      this.draftActionForm.formName == "QuestionAnswerForm"
    ) {
      return this.draftActionForm;
    }
    return null;
  }

  @Mutation
  setCurrentUser(currentUser: CurrentUserI) {
    this.currentUser = currentUser;
  }

  @Mutation
  updateUserOnlineStatus(onlineStatus: "ONLINE" | "OFFLINE" | "BUSY") {
    if (this.currentUser) this.currentUser["onlineStatus"] = onlineStatus;
  }

  @Mutation
  setLoginSuccessRedirectUrl(url: string | null) {
    this.loginSuccessRedirectUrl = url;
  }

  @Mutation
  commitDraftForm(data: draftActionFormI | null) {
    this.draftActionForm = data;
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

  @Action
  async loginSuccessRedirectUrlAction(urlValue: string | null) {
    await this.context.commit("setLoginSuccessRedirectUrl", urlValue);
  }

  @Action
  async setDraftFormAction(formData: draftActionFormI | null) {
    await this.context.commit("commitDraftForm", formData);
  }
}
