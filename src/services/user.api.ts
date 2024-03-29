import LoginDTO from "@/dto/request/login.dto";
import LoginWithTokenDTO from "@/dto/request/login-withtoken.dto";
import RegisterUserDTO from "@/dto/request/register.dto";
import LoginResponseDTO from "@/dto/response/login-response.dto";
import VerifyUserDTO from "@/dto/request/user-verify.dto";
import VerifyUserOtpDTO from "@/dto/request/user-otp-verify.dto";
import UserProfileDTO from "@/dto/user/profile.dto";
import QuestionListResponseDTO from "@/dto/response/question-list-response.dto";
import RegisterUserResponseDTO from "@/dto/response/register-response.dto";
import APIService from "./http-common";

class UserAPIService extends APIService {
  async login(loginDetail: LoginDTO): Promise<LoginResponseDTO> {
    const response = await this.axiosCall<LoginResponseDTO>(
      {
        method: "POST",
        url: "/auth/login",
        data: loginDetail,
      },
      LoginDTO,
      LoginResponseDTO
    );
    return response;
  }

  async loginWithToken(
    loginDetail: LoginWithTokenDTO
  ): Promise<LoginResponseDTO> {
    const response = await this.axiosCall<LoginResponseDTO>(
      {
        method: "POST",
        url: "/auth/loginwithtoken",
        data: loginDetail,
      },
      LoginWithTokenDTO,
      LoginResponseDTO
    );
    return response;
  }

  async register(
    registerDetail: RegisterUserDTO
  ): Promise<RegisterUserResponseDTO> {
    const response = await this.axiosCall<RegisterUserResponseDTO>(
      {
        method: "POST",
        url: "/auth/register",
        data: registerDetail,
      },
      RegisterUserDTO
    );
    return response;
  }

  async getMyQuestions(
    showOnlyOpen = false
  ): Promise<QuestionListResponseDTO[]> {
    const response = await this.axiosCall<QuestionListResponseDTO[]>({
      method: "GET",
      url: `/questions/my-questions/${showOnlyOpen}`,
    });
    return response;
  }

  async getMyOffers(): Promise<any[]> {
    const response = await this.axiosCall<any[]>({
      method: "GET",
      url: `/offers/my-offers`,
    });
    return response;
  }

  async getMyComments(): Promise<any[]> {
    const response = await this.axiosCall<any[]>({
      method: "GET",
      url: `/comments/my-comments`,
    });
    return response;
  }

  async getProfile(id: string): Promise<UserProfileDTO> {
    const response = await this.axiosCall<UserProfileDTO>({
      method: "GET",
      url: `/users/profile/${id}`,
    });
    return response;
  }

  async getProfileByToken(token: string): Promise<UserProfileDTO> {
    const response = await this.axiosCall<UserProfileDTO>({
      method: "GET",
      url: `/users/profile-by-token/${token}`,
    });
    return response;
  }

  async getSolutionAttempts(userId: string): Promise<any[]> {
    return await this.axiosCall<any[]>({
      method: "GET",
      url: `/solution-attempt/by/${userId}`,
    });
  }

  async updateProfile(
    updateValue: any,
    coverImage: File | null,
    profileImage: File | null
    // cover: Blob | null
  ): Promise<any> {
    console.log("update profile axios call from client side", updateValue);

    if (coverImage || profileImage) {
      const formData = new FormData();
      Object.entries(updateValue).forEach(([key, value]) => {
        console.log("key", key);

        let v = value;
        if (Array.isArray(value) && typeof value[0] === "object") {
          v = JSON.stringify(value);
        } else if (Array.isArray(value)) {
          v = value.join(",");
        }
        formData.append(key, v as string);
      });

      if (coverImage) {
        formData.append("images", coverImage, "profileCoverImage");
      }

      if (profileImage) {
        formData.append("images", profileImage, "profileImage");
      }

      const response = await this.axiosCall<any>({
        method: "POST",
        url: "/users/updateme",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response;
    } else {
      const formData = updateValue;
      const response = await this.axiosCall<any>({
        method: "POST",
        url: "/users/updateme",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    }
  }

  async verifyUser(verifyDetail: VerifyUserDTO): Promise<UserProfileDTO> {
    const response = await this.axiosCall<UserProfileDTO>({
      url: "/auth/verification",
      method: "POST",
      data: verifyDetail,
    });
    return response;
  }

  async verifyUserOTP(verifyDetail: VerifyUserOtpDTO): Promise<UserProfileDTO> {
    const response = await this.axiosCall<UserProfileDTO>({
      url: "/auth/otpverification",
      method: "POST",
      data: verifyDetail,
    });
    return response;
  }

  async sendVerificationLink(username: string): Promise<any> {
    const response = await this.axiosCall<any>({
      url: "/auth/sendverification",
      method: "POST",
      data: { username: username },
    });
    return response;
  }

  async sendResetPasswordLink(emailId: string): Promise<any> {
    const response = await this.axiosCall<any>({
      url: "/auth/sendresetpasswordlink",
      method: "POST",
      data: { emailId: emailId },
    });
    return response;
  }

  async markOfferRead(offerId: string, readStatus: boolean): Promise<any> {
    const response = await this.axiosCall<any>({
      url: `/offers/markread/${offerId}/${readStatus}`,
      method: "GET",
    });
    return response;
  }

  async getUnreadOffers(
    countOnly: boolean,
    showReadOffers: boolean
  ): Promise<any> {
    const response = await this.axiosCall<any>({
      url: `/offers/unread/${countOnly}/${showReadOffers}`,
      method: "GET",
    });
    return response;
  }

  async setOnlineStatus(status: "ONLINE" | "OFFLINE" | "BUSY"): Promise<any> {
    const response = await this.axiosCall<any>({
      url: `/users/set-online-status/${status}`,
      method: "GET",
    });
    return response;
  }

  async addNewAskMeToken(name: string): Promise<any> {
    return await this.axiosCall<any>({
      url: `/users/add-new-ask-me-token/${name}`,
      method: "GET",
    });
  }

  async removeAskMeToken(token: string): Promise<any> {
    return await this.axiosCall<any>({
      url: `/users/remove-ask-me-token/${token}`,
      method: "GET",
    });
  }
}

export default new UserAPIService();
