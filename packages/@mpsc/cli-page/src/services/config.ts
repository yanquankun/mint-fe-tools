interface IConfigForm {
  desc: string;
  version: string;
  groupNotice: boolean;
  isProd: boolean;
  isAutoUpdateQrcode?: boolean;
  isCreateTag?: boolean;
}

export type { IConfigForm };
