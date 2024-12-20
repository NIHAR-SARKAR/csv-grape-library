import { CsvData, CsvContent, MetaData } from "./csvModel";
import { CsvHandlerService } from "./csv-handler.service";

export class CsvGrape {

  static response : CsvData = { Content: {}, HasError: true, Headers: [], FileName: "", Index: 0 };
  static content : CsvContent = { Data: this.response, Metadata: {} }
  static csvHandlerService: CsvHandlerService = new CsvHandlerService();
  constructor() {
  }
  public static getCsvData(event: Event, rowLimit: number = 200): Promise<CsvData> {
    return new Promise((resolve, reject) => {
      this.csvHandlerService.handleSingleFile(event, rowLimit).then((_response) => {
        resolve(_response);
      }, (err) => {
        reject(err);
      });
    });
  }
  public static getMetaData(csvRecordsArray: any, headersRow: any) {
    return this.csvHandlerService.getColumnDataTypes(csvRecordsArray, headersRow);
  }
  public static getCsvWithMetaData(event: Event, rowLimit: number = 200): Promise<CsvContent> {
    return new Promise((resolve, reject) => {
      this.csvHandlerService.handleSingleFile(event, rowLimit).then((_response) => {
        this.content.Data = _response;
        this.content.Metadata = this.csvHandlerService.getColumnDataTypes(_response.Content, _response.Headers);
        resolve(this.content);
      }, (err) => {
        reject(this.content);
      });
    });
  }

}

