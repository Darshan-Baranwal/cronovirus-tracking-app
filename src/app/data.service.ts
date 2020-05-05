import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {IGlobalData} from './model/global-data';
import {DatewiseData} from './model/datewise-data';

@Injectable({
  providedIn: 'root'
})
export class DataService {
dateString = (new Date().getMonth() < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) + '-' + (new Date().getDate() - 1) + '-' + new Date().getFullYear();
globalDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/05-04-2020.csv`;
dateWiseDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv`;
constructor(private http: HttpClient) { }
  getDateWiseDate() {
    return this.http.get(this.dateWiseDataUrl, {responseType: 'text'}).pipe(
      map(result => {
        const rows = result.split('\n');
        const headers = rows.splice(0, 1)[0].split(',');
        const headerValues = headers.splice(0, 4);
        const headerDates = headers;
        return rows.map(v => v.split(','))
          .reduce((acc: {[country: string]: DatewiseData[]}, value) => {
          const datesData = value.slice(4);
          if (acc[value[1]]) {
            acc[value[1]].forEach((v, i) =>
              acc[value[1]][i].case = v.case + Math.abs(parseInt(datesData[i]) === NaN ? 0 : parseInt(datesData[i])));
          } else {
            acc[value[1]] = datesData.map((v, i) => {
                return {
                  date: new Date(headerDates[i]),
                  country: value[1],
                  case: parseInt(v)
                };
              }
            ) as DatewiseData[];
          }
          return acc;
        }, {}
        );
      })
    );
  }
  getGlobalData() {
    return this.http.get(this.globalDataUrl, {responseType: 'text'}).pipe(
      map(result => {
        return result.split('\n').slice(1).map(v => v.split(',')).reduce((acc: {[country: string]: IGlobalData}, value: any) => {
          const countryExisting = acc[value[3]];
          if (countryExisting) {
            // tslint:disable-next-line:radix
            acc[value[3]].confirmed = countryExisting.confirmed + Math.abs(parseInt(value[7]));
            acc[value[3]].deaths = countryExisting.deaths + Math.abs(parseInt(value[8]));
            acc[value[3]].recovered = countryExisting.recovered + Math.abs(parseInt(value[9]));
            acc[value[3]].active = countryExisting.active + Math.abs(parseInt(value[10]));
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
