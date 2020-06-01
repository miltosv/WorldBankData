import { Injectable } from '@angular/core';

@Injectable()
export class ConnectData {

  readonly baseURL = 'http://localhost:3000';

  getCountriesList() {
    const url = `${this.baseURL}/countries`;
    console.log(url);
    return fetch(url);
  }

  getInticatorsList() {
    const url = `${this.baseURL}/indicators`;
    console.log(url);
    return fetch(url);
  }

  getYearsList() {
    const url = `${this.baseURL}/years`;
    console.log(url);
    return fetch(url);
  }

  getYearsForPeriod(period,year){
    const url = `${this.baseURL}/years/${period},${year}`;
    console.log(url);
    return fetch(url);
  }

  getMesurement(country,indicator,year){
    const url = `${this.baseURL}/mesurement/${country},${indicator},${year}`;
    console.log(url);
    return fetch(url);
  }

}
