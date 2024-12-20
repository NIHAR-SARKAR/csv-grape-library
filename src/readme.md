# csv-grape

[![Csv-Grape npm](https://img.shields.io/npm/v/csv-grape.svg?style=plastic&logo=npm)](https://www.npmjs.com/package/csv-grape)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://www.gnu.org/licenses/gpl-3.0.txt)
[![Build Pass](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/Open-range-org/Documentation/blob/main/csv-grape.md)

A library that handles csv files and its metadata for js or typescript projects.

## Installation

```bash
npm install csv-grape

```




## Initiate the service

```bash
import { CsvGrape } from 'csv-grape';

```

## Get all csv content

```bash
  
    CsvGrape.getCsvData(event,limit).then((_response)=>{
      this.data=_response;
      
    },(reject)=>{
      console.log(reject);
    });

```

`limit` is an optional parameter . When the file size is very big and you don't want to load full file . Use limit parameter to get limited rows from the csv file.

##  Get csv file metadata

```bash
//Here we can get _response from getCsvData(event,limit)
this.csvMetaData=  JSON.stringify(CsvGrape.getMetaData(_response.Data,_response.Headers));

```

`limit` is an optional parameter . When the file size is very big and you don't want to load full file . Use limit parameter to get limited rows from the csv file.


##  Get csv content with metadata

```bash

CsvGrape.getCsvWithMetaData(event,limit).then((_response)=>{
      this.csvJsonAndMetaData=_response;
    },(reject)=>{
      console.log(reject);
    });

```

`limit` is an optional parameter . When the file size is very big and you don't want to load full file . Use limit parameter to get limited rows from the csv file.


##  Sample Data

```json

{
    "Data": {
        "Data": [
            {
                "description": "description",
                "industry": "industry",
                "level": "level",
                "size": "size",
                "line_code": "line_code",
                "value": "value"
            },
            {
                "description": "Type of outstanding debt: bank overdrafts",
                "industry": "total",
                "level": "0",
                "size": "619 employees",
                "line_code": "D0201",
                "value": "13215"
            },
            {
                "description": "Type of outstanding debt: bank overdrafts",
                "industry": "total",
                "level": "0",
                "size": "2049 employees",
                "line_code": "D0201",
                "value": "3405"
            },
            {
                "description": "Type of outstanding debt: bank overdrafts",
                "industry": "total",
                "level": "0",
                "size": "5099 employees",
                "line_code": "D0201",
                "value": "978"
            },
            {
                "description": "Type of outstanding debt: bank overdrafts",
                "industry": "total",
                "level": "0",
                "size": "100+ employees",
                "line_code": "D0201",
                "value": "687"
            }
        ],
        "HasError": false,
        "Headers": [
            "description",
            "industry",
            "level",
            "size",
            "line_code",
            "value"
        ],
        "FileName": "business-operations-survey-2022-business-finance.csv",
        "Index": 0
    },
    "Metadata": {
        "description": {
            "Type": "String",
            "Variable": "DESCRIPTION"
        },
        "industry": {
            "Type": "String",
            "Variable": "INDUSTRY"
        },
        "level": {
            "Type": "String",
            "Variable": "LEVEL"
        },
        "size": {
            "Type": "String",
            "Variable": "SIZE"
        },
        "line_code": {
            "Type": "String",
            "Variable": "LINE_CODE"
        },
        "value": {
            "Type": "String",
            "Variable": "VALUE"
        },
        "Headers": [
            "description",
            "industry",
            "level",
            "size",
            "line_code",
            "value"
        ]
    }
}

```