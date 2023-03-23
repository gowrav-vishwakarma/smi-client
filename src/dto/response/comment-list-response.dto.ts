import ByUser from "../byUser.dto";
import SolutionChannelsDTO from "../solution-channels.dto";

export class commentValue {
  totalVoteCount!: number;
  totalVoteDownCount!: number;
}

export default class QuestionListResponseDTO {
  _id!: string;

  commenterId!: string;

  comment!: string;

  questionId!: string;

  createdAt!: string;

  commentValue!: commentValue;

  __v!: number;

  User!: ByUser;
  myVote!: {
    vote: number;
  };
}
