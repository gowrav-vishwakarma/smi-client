class questionerDTO {
  email!: string;
  name!: string;
}

class offererDTO {
  name!: string;
  ratingAsSolver!: any;
  // {
  //   totalQuestionsAsked: 0;
  //   totalMarkedSolved: 0;
  //   totalRatingsCount: 0;
  //   totalRatingsSum: 0;
  // };
}

export default class SolutionAttemptDetailResponseDTO {
  _id!: string;

  notes!: string;

  questionId!: string;

  offererId!: string;

  offerId!: string;

  questionerId!: string;

  status!: string;

  questioner!: questionerDTO;

  offerer!: offererDTO;
}
