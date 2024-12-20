import { CsvData, CsvContent, MetaData } from "./csvModel";
import { CsvHandlerService } from "./csv-handler.service";

export class CsvGrape {

  response: CsvData = { Content: {}, HasError: true, Headers: [], FileName: "", Index: 0 };
  content: CsvContent = { Data: this.response, Metadata: {} }

  constructor(private csvHandlerService: CsvHandlerService) {
  }
  public getCsvData(event: any): Promise<CsvData> {
    return new Promise((resolve, reject) => {
      this.csvHandlerService.handleSingleFile(event).then((_response) => {
        resolve(_response);
      }, (err) => {
        reject(err);
      });
    });
  }
  public getMetaData(csvRecordsArray: any, headersRow: any) {
    return this.csvHandlerService.getColumnDataTypes(csvRecordsArray, headersRow);
  }
  public getCsvWithMetaData(event: any): Promise<CsvContent> {
    return new Promise((resolve, reject) => {
      this.csvHandlerService.handleSingleFile(event).then((_response) => {
        this.content.Data = _response;
        this.content.Metadata = this.csvHandlerService.getColumnDataTypes(_response.Content, _response.Headers);
        resolve(this.content);
      }, (err) => {
        reject(this.content);
      });
    });
  }

}

