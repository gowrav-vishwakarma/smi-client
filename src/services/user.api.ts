import LoginDTO from "@/dto/request/login.dto";
import RegisterUserDTO from "@/dto/request/register.dto";
import LoginResponseDTO from "@/dto/response/login-response.dto";
import UserProfileDTO from "@/dto/user/profile.dto";
import QuestionDetailResponseDTO from "@/dto/response/question-detail-response.dto";
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

  async getMyQuestions(): Promise<QuestionListResponseDTO[]> {
    const response = await this.axiosCall<QuestionListResponseDTO[]>({
      method: "GET",
      url: `/questions/my-questions`,
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

  async updateProfile(
    updateValue: any,
    coverImage: File | null,
    profileImage: File | null
    // cover: Blob | null
  ): Promise<any> {
    console.log("update profile axios call from client side", updateValue);

    const formData = new FormData();
    Object.entries(updateValue).forEach(([key, value]) => {
      let v = Array.isArray(value) ? value.join(",") : value;
      if (typeof v === "object") v = JSON.stringify(v);

      formData.append(key, v as string);
    });

    if (coverImage) {
      // formData.append("coverImage", coverImage);
      formData.append("images", coverImage, "coverImage");
    }

    if (profileImage) {
      // formData.append("profileImage", profileImage);
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
  }

  async verifyUser(verifyDetail: {
    username: string;
    authToken: string;
  }): Promise<UserProfileDTO> {
    const response = await this.axiosCall<UserProfileDTO>({
      url: "/auth/verification",
      method: "POST",
      data: verifyDetail,
    });
    return response;
  }
}

export default new UserAPIService();
