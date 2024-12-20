import { Component } from '@angular/core';
import { CsvData, CsvGrape, CsvContent} from 'csv-grape';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'test';
  data!: CsvData;
  csvJson:string = '';
  csvMetaData:string = '';
  csvJsonAndMetaData!:CsvContent;
  csvJsonAndMetaDatatext:string = '';
  constructor(){
  }
  onFileSelected(event:Event) {
    CsvGrape.getCsvData(event,20).then((_response)=>{
      this.data=_response;
      this.csvJson=JSON.stringify(this.data);
      this.csvMetaData=  JSON.stringify(CsvGrape.getMetaData(_response.Content,_response.Headers));
    },(reject)=>{
      console.log(reject);
    });

    CsvGrape.getCsvWithMetaData(event,5).then((_response)=>{
      this.csvJsonAndMetaData=_response;
      this.csvJsonAndMetaDatatext=JSON.stringify(_response);
    },(reject)=>{
      console.log(reject);
    });
  }

}
