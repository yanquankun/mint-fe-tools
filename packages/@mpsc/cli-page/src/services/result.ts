interface IResult {
  extraInfo: {
    branch: string;
    buildSuccessAppNames: string;
    reomte: string;
    tag: string;
    user: string;
  };
  qrcodeFiles: {
    fileName: string;
    baseUrl: string;
  }[];
}

export type { IResult };
