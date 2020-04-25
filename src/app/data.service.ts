import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {IGlobalData} from './model/global-data';

@Injectable({
  providedIn: 'root'
})
export class DataService {
dateString = (new Date().getMonth() < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) + '-' + (new Date().getDate() - 1) + '-' + new Date().getFullYear();
globalDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${this.dateString}.csv`;
dateWiseDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv`;
constructor(private http: HttpClient) { }
  getGlobalData() {
    return this.http.get(this.globalDataUrl, {responseType: 'text'}).pipe(
      map(result => {
        return result.split('\n').slice(1).map(v => v.split(',')).reduce((acc: {[country: string]: IGlobalData}, value: any) => {
          const countryExisting = acc[value[3]];
          if (countryExisting) {
            // tslint:disable-next-line:radix
            acc[value[3]].confirmed = countryExisting.confirmed + parseInt(value[7]);
            acc[value[3]].deaths = countryExisting.deaths + parseInt(value[8]);
            acc[value[3]].recovered = countryExisting.recovered + parseInt(value[9]);
            acc[value[3]].active = countryExisting.active + parseInt(value[10]);
          } else {
            acc[value[3]] = {
              country: value[3],
              confirmed: +value[7],
              deaths: +value[8],
              recovered: +value[9],
              active: +value[10]
            };
          }
          return acc;
        }, {});
      })
    );
  }
}
