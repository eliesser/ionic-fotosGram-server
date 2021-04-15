export interface FileUpload {
  name: string;
  data: string;
  encoding: string;
  tempFilePath: string;
  truncated: boolean;
  mimetype: string;

  mv: Function;
}
