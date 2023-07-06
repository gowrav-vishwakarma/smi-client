import CreateSolutionAttemptDTO from "@/dto/request/create-solution-attempt.dto";
import APIService from "./http-common";

class SolutionsAPIService extends APIService {
  async createSolutionAttempt(
    solutionAttempt: CreateSolutionAttemptDTO
  ): Promise<any> {
    return await this.axiosCall<any>({
      method: "POST",
      url: "/solution-attempt/create",
      data: solutionAttempt,
    });
  }

  async createSolutionRating(
    ratingParam: {
      rating: number;
      comment: string;
      solutionAttemptId: string;
      forOfferer: boolean;
      forQuestioner: boolean;
      offererId: string;
      questionId: string;
      questionerId: string;
      markedSolved: boolean;

      videoText: string | null;
    },
    solutionVideoBlob: Blob | null,
    onUploadProgress: (progressEvent: ProgressEvent) => void
  ): Promise<any> {
    // console.log("sending Rating Data", ratingParam);

    const formData = new FormData();
    Object.entries(ratingParam).forEach(([key, value]) => {
      let v = Array.isArray(value) ? value.join(",") : value;
      if (typeof v === "object") v = JSON.stringify(v);

      formData.append(key, v as string);
    });
    if (solutionVideoBlob) {
      formData.append("solutionVideoBlob", solutionVideoBlob);
    }

    return await this.axiosCall<any>({
      method: "POST",
      url: "/solution-attempt/createrating",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }

  async getSolutionAttempt(id: string): Promise<any> {
    return await this.axiosCall<any>({
      method: "GET",
      url: `/solution-attempt/${id}`,
    });
  }

  async removeSolutionOffer(id: string): Promise<any> {
    return await this.axiosCall<any>({
      method: "DELETE",
      url: `offers/remove-solution-offer/${id}`,
    });
  }
}

export default new SolutionsAPIService();
