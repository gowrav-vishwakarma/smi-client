import { CreateQuestionDTO } from "@/dto/request/create-question.dto";
import { FilterQuestionsDTO } from "@/dto/request/question-filter.dto";
import QuestionDetailResponseDTO from "@/dto/response/question-detail-response.dto";
import QuestionListResponseDTO from "@/dto/response/question-list-response.dto";
import APIService from "./http-common";

class CommentsAPIService extends APIService {
  async getComments(id: string): Promise<any> {
    const response = await this.axiosCall<any>({
      method: "GET",
      url: `/questions/${id}/comments`,
    });
    return response;
  }

  async createComment(
    questionId: string,
    comment: string,
    video: Blob | null,
    onUploadProgress: (progressEvent: ProgressEvent) => void
  ): Promise<any> {
    const formData = new FormData();
    // Object.entries(ratingParam).forEach(([key, value]) => {
    //   let v = Array.isArray(value) ? value.join(",") : value;
    //   if (typeof v === "object") v = JSON.stringify(v);
    formData.append("questionId", questionId as string);
    formData.append("comment", comment as string);
    // });
    if (video) {
      formData.append("video", video);
    }

    const response = await this.axiosCall<any>({
      method: "POST",
      url: "/comments/create",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
    return response;
  }

  async vote(commentId: string, vote: "up" | "down"): Promise<any> {
    const response = await this.axiosCall<any>({
      method: "GET",
      url: "/comments/vote/" + commentId + "/" + vote,
    });
    return response;
  }

  async deleteComment(commentId: string): Promise<any> {
    const response = await this.axiosCall<any>({
      method: "GET",
      url: "comments/delete-comment/" + commentId,
    });
    return response;
  }
}

export default new CommentsAPIService();
