import { IsMongoId } from "class-validator";
import byUser from "@/dto/byUser.dto";

export default class CreateSolutionAttemptDTO {
  @IsMongoId()
  questionId!: string;

  @IsMongoId()
  questionerId!: string;

  @IsMongoId()
  offererId!: string;

  questioner!: any;
  offerer!: any;
  notes!: string;
}
