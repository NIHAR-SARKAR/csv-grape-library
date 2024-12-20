export interface CsvData {
  HasError: boolean;
  Content: any;
  Headers: string[];
  FileName: string;
  Index: number;
}
export interface GroupResponse {
  GroupId: number;
  MetaData: any;
  Headers: any[];
  FileIndexList: number[];
}
export interface MetaData {
  Type: string;
  Variable: string;
}
export interface CsvContent {
  Data: CsvData;
  Metadata: any;
}

