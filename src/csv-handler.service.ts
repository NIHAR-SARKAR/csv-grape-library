import { CsvData, GroupResponse, MetaData } from './csvModel';
import { Config } from "./constants";

export class CsvHandlerService {

  constructor() { }

  public records: any[] = [];
  async handleMultipleFIle($event: Event, rowLimit: number = -1): Promise<CsvData[]> {

    var fileList: CsvData[] = [];
    try {
      let files = (<HTMLInputElement>$event.target).files;
      if (files === null) {
        return [];
      }
      for (var i = 0; i < files?.length; i++) {
        var fileData = await this.ProcessCsv($event, rowLimit, i);
        fileList.push(fileData);
      }
    }
    catch (err) {
      console.log("Could not read or processs the file!");
    }
    return fileList;
  }
  public handleSingleFile($event: Event, rowLimit: number = -1): Promise<CsvData> {
    return new Promise((resolve, reject) => {
      this.ProcessCsv($event, rowLimit).then((_response) => {
        resolve(_response);
      }, (err) => {
        reject(err);
      });
    });
  }
  private ProcessCsv($event: Event, rowLimit: number, index = 0): Promise<CsvData> {

    let files = (<HTMLInputElement>$event.target).files;
    let response: CsvData = { Content: [], HasError: true, Headers: [], FileName: "", Index: 0 };
    return new Promise((resolve, reject) => {
      if (!files) {
        return;
      }
      if (this.isValidCSVFile(files[index])) {

        let input = $event.target;
        let reader = new FileReader();
        let bufferEnd = rowLimit * 1000;

        rowLimit < 0 ? reader.readAsText(files[index].slice(0, Number.MAX_SAFE_INTEGER)) : reader.readAsText(files[index].slice(0, bufferEnd));

        reader.onload = () => {
          if (files === null) {
            return;
          }
          let csvData = reader.result;
          let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

          let headersRow = this.getHeaderArray(csvRecordsArray);
          response.Content = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow, rowLimit);
          response.HasError = false;
          response.Headers = headersRow;
          response.FileName = files[index].name;
          response.Index = index;
          resolve(response);
        };
        reader.onerror = function (err: any) {
          console.log(err.target.error);
          reject(response);
        };

      } else {
        reject(response);
      }
    });

  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headersRow: any, limit: number = Number.MAX_SAFE_INTEGER): any {
    let csvArr = [];
    limit = limit === -1 ? Number.MAX_SAFE_INTEGER : limit;
    let length = csvRecordsArray.length > limit ? limit : csvRecordsArray.length;
    for (let i = 1; i < length; i++) {
      let curruntRecord = this.csvToArray(<string>csvRecordsArray[i]);
      if (curruntRecord.length == headersRow.length) {
        let csvRecord: any = {};
        for (let index = 0; index < headersRow.length; index++) {
          try {
            var x = index.toString();
            csvRecord[headersRow[x].toString()] = curruntRecord[index].trim();
          } catch (error) {
            console.log(error)
          }
        }

        csvArr.push(csvRecord);
      }
    }
    return csvArr;
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = this.csvToArray(<string>csvRecordsArr[0]);
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      var val = headers[j];
      if (val == '') {
        val = "no_header_" + j;
      }
      headerArray.push(val);
    }
    return headerArray;
  }
  CompareArrays(arr1: [], arr2: []) {
    let missing = arr1.filter(item => arr2.indexOf(item) < 0);
    return missing;
  }
  csvToArray(text: string): any {
    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    if (!re_valid.test(text)) return null;
    var a = [];
    text.replace(re_value,
      function (m0, m1, m2, m3) {
        if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
        else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
        else if (m3 !== undefined) a.push(m3);
        return '';
      });
    if (/,\s*$/.test(text)) a.push('');
    return a;
  }
  getColumnDataTypes(csvRecordsArray: any, headersRow: any) {
    let types: any = {};
    var noHeaderCount = 1;
    for (let index = 0; index < headersRow.length; index++) {
      let obj: MetaData = { Type: "", Variable: "" };
      let columnName = headersRow[index].toString();
      var columnRecord = csvRecordsArray.map((a: any) => a[columnName]);
      let type = this.validateDataType(columnRecord);
      var variable = columnName.toUpperCase();
      if (variable.includes("NO_HEADER_")) {
        variable = "NO_HEADER_" + noHeaderCount;
        noHeaderCount++;
      }

      obj.Type = type;
      obj.Variable = variable.replace(/-|_/g, " ").replace(/[^a-zA-Z0-9 ]/g, '').replace(/  +/g, ' ').replace(/\s/g, '_');
      types[columnName] = obj;
    }
    types.Headers = headersRow;
    return types;
  }
  validateDataType(arr: any) {
    if (arr.filter((n: any) => { return !/^\d+$/.test(n) }).length == 0) {
      return "Number";
    }
    else if (arr.filter((n: any) => { return !/^[+-]?\d+(\.\d+)?$/.test(n) }).length == 0) {
      return "Float";
    }
    else if (arr.filter((n: any) => Number.isNaN(Date.parse(n))).length == 0) {
      return "Date";
    }
    else {
      return "String";
    }

  }
  getFileGroups(dataTypeArray: any[]): GroupResponse[] {
    let groups: GroupResponse[] = [];
    for (let i = 0; i < dataTypeArray.length; i++) {
      if (groups.length == 0) {
        let group: GroupResponse = { GroupId: 0, MetaData: dataTypeArray[i], FileIndexList: [], Headers: dataTypeArray[i].Headers };
        group.FileIndexList.push(i);
        groups.push(group);
      }
      else {
        let flag = false;
        for (let j = 0; j < groups.length; j++) {
          let isEqual = JSON.stringify(dataTypeArray[i]) === JSON.stringify(groups[j].MetaData);
          if (isEqual) {
            flag = true;
            groups[j].FileIndexList.push(i);
            break;
          }
        }
        if (!flag) {
          let group = { GroupId: groups.length, MetaData: dataTypeArray[i], FileIndexList: [i], Headers: dataTypeArray[i].Headers, IsActive: true }
          groups.push(group);
        }
      }
    }
    return groups;
  }

}
