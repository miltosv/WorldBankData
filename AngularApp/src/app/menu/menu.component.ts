import {Component, OnInit, ɵɵcontainerRefreshEnd} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ConnectData} from '../data/data.service';
import {Router} from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';


export class Country{
  COUNTRY_CODE: string;
  COUNTRY_NAME: string;
}

export class Indicator{
  INDICATOR_CODE: string;
  INDICATOR_NAME: string;
}

export class Year{
  YEAR: number;
}

export interface Group{
  GROUP_CODE: string;
  GROUP_NAME: string;
}

//interfaces to prepare data for the charts
export interface valuePair{
  name:string,
  value:number;
}

export interface valuesPerCountry{
  name: string,
  series: valuePair[];
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit{

  //lists for the available countries indicators and years
  countriesList=[];
  indicatorsList=[];
  years=[];
  //selected values
  countries = new FormControl();
  indicators = new FormControl();
  year= new FormControl();
  group= new FormControl();
  //if the user change the selected values
  flag=false;
  //prepare for final data
  yearsForPeriod = [];
  //final data for the graph
  finalData: valuesPerCountry[] = [];
  //flag for the graph
  flagGraph=false;
  // Graph options
  view: any[] = [1300, 700];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Year';
  showYAxisLabel = true;
  timeline = true;
  colorScheme = {
    domain: ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080',
      '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080',]
  };
  yAxisLabel: string;

  constructor(private connectData: ConnectData , private router:Router){}

  async ngOnInit(){
    this.refresh();
  }

  async refresh(){
    //upload all the available countries
    await this.connectData.getCountriesList().then(response => response.json())
    .then(data => {
        Object.values(data).forEach(entry => {
          let arr = Object.values(entry);
          let country = new Country();
          let code =JSON.stringify(arr[0]);
          let name = JSON.stringify(arr[1]);
          //we use slice to delete the "" from the string
          country.COUNTRY_CODE = code.slice(1, code.length-1);
          country.COUNTRY_NAME = name.slice(1, name.length-1);
          this.countriesList.push(country);
        });
    })
    .catch(error => console.error(error));

    //upload all the available indicators
    await this.connectData.getInticatorsList().then(response => response.json())
    .then(data => {
        Object.values(data).forEach(entry => {
          let arr = Object.values(entry);
          let indicator =new Indicator();
          let code = JSON.stringify(arr[0]);
          let name = JSON.stringify(arr[1]);
          indicator.INDICATOR_CODE = code.slice(1, code.length-1);
          indicator.INDICATOR_NAME = name.slice(1, name.length-1);
          this.indicatorsList.push(indicator);
        });
    })
    .catch(error => console.error(error));

    //upload all the available years
    await this.connectData.getYearsList().then(response => response.json())
    .then(data => {
        Object.values(data).forEach(entry => {
          let arr = Object.values(entry);
          let tmp =  JSON.stringify(arr[0]);
          let year =new Year();
          year.YEAR = parseInt(tmp);
          this.years.push(year);
        });
    })
    .catch(error => console.error(error));

  }

  groups: Group[] = [
    {GROUP_CODE: 'YEAR', GROUP_NAME: '1 Year'},
    {GROUP_CODE: '5YR_PERIOD', GROUP_NAME: '5 Years'},
    {GROUP_CODE: '10YR_PERIOD', GROUP_NAME: '10 Years'},
    {GROUP_CODE: '20YR_PERIOD', GROUP_NAME: '20 Years'}
  ];

  //method for submit button prepare all the data
  async submitInfo(){

    if(this.countries.value!=null && this.indicators.value!=null && this.year.value !=null && this.group.value !=null){

      //upload all the years the selected period
      await this.connectData.getYearsForPeriod(this.group.value,this.year.value).then(response => response.json())
      .then(data => {
        Object.values(data).forEach(entry => {
          let arr = Object.values(entry);
          let tmp =  JSON.stringify(arr[0]);
          this.yearsForPeriod.push(tmp);
        });
      })
      .catch(error => console.error(error));

      /*console.log(this.yearsForPeriod);
      console.log(this.countries.value);
      console.log(this.indicators.value);
      console.log(this.group.value);*/

      //loops for every indicator -> i, country -> c and year -> y
      for(var i=0; i<this.indicators.value.length; i++){
        for(var c=0; c<this.countries.value.length; c++){
          let tmpAr: valuesPerCountry;
          let tmpValues: valuePair[] = [];
          for(var y=0; y<this.yearsForPeriod.length; y++){
            await this.connectData.getMesurement(this.countries.value[c].COUNTRY_CODE,this.indicators.value[i].INDICATOR_CODE,this.yearsForPeriod[y]).then(response => response.json())
            .then(data => {
              //we use if for null data
              if(data.length > 0){
                let arr = Object.values(data[0]);
                let tmp =  JSON.stringify(arr[0]);
                let mes = parseFloat(tmp);
                let tmpMes: valuePair = ({name: this.yearsForPeriod[y], value: mes});
                tmpValues.push(tmpMes);
              }
            })
            .catch();
          }
          tmpAr=({name: this.countries.value[c].COUNTRY_NAME + " " +  this.indicators.value[i].INDICATOR_NAME, series: tmpValues});
          this.finalData.push(tmpAr);
        }
        //this.yAxisLabel= this.yAxisLabel + " and "+ this.indicators.value[i].INDICATOR_NAME;
      }
    }else{
      alert('Something went wrong..Select again!');
    }
    console.log(this.finalData);

    if (this.finalData!=null){
      this.flagGraph=true;
    }else{
      alert('Something went wrong!');
    }
  }

  initialize(){
    this.countriesList=[];
    this.indicatorsList=[];
    this.years=[];
    this.countries = new FormControl();
    this.indicators = new FormControl();
    this.year= new FormControl();
    this.group= new FormControl();
    this.finalData=[];
    this.flagGraph=false;
    this.yearsForPeriod = [];
    this.yAxisLabel="";
    this.ngOnInit();
  }

}

