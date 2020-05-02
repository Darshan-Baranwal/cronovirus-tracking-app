import {Component, OnInit, ViewChild} from '@angular/core';
import {IGlobalData} from '../model/global-data';
import {DataService} from '../data.service';
import {DatewiseData} from '../model/datewise-data';
import {merge} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-comparison',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.css']
})
export class ComparisonComponent implements OnInit {
  @ViewChild('countryChart', {static: true}) countryChart
  graphWidth= 500;
  graphHeight = 500;
  selectedValue1: IGlobalData;
  selectedValue2: IGlobalData;
  countriesData: { [country: string]: DatewiseData[] };
  countryData: DatewiseData[];
  countriesList1: IGlobalData[];
  countriesList2: IGlobalData[];
  dataTable: any[];
  comparisonChart: any;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    merge(this.dataService.getDateWiseDate().pipe(map(data => {
      this.countriesData = data;
      console.log(data);
      this.countryData = data.US;
      // this.updateChart();
    })
    ),
      this.dataService.getGlobalData().pipe(
        map(data => {
          this.countriesList1 = Object.values(data).filter(v => !!v.country) as IGlobalData[];
          this.selectedValue1 = this.countriesList1[0];
          this.selectedValue2 = this.countriesList1[1];
          this.countriesList2 = this.countriesList1.filter(v => v.country !== this.selectedValue1.country);
        })
      )
    ).subscribe(
      {
        complete: () => {
          this.updateChart();
        },
      }
    );
    /*this.dataService.getDateWiseDate().subscribe(
      data => {this.countriesData = data; console.log(data); this.countryData = data.US; this.updateChart(); }
    );
    this.dataService.getGlobalData().subscribe(
      data => {
        this.countriesList = Object.values(data).filter(v => !!v.country) as IGlobalData[];
        this.selectedValue1 = this.countriesList[0];
        this.selectedValue1 = this.countriesList[1];
      }
    );*/
  }

  updateChart() {
    this.dataTable = [];
    this.countriesData[this.selectedValue1.country].forEach((cs, i) => {
      this.dataTable.push([cs.date , cs.case, this.countriesData[this.selectedValue2.country][i].case]);
    });
    this.comparisonChart = {
      // tslint:disable-next-line:max-line-length
      title: `${(this.selectedValue1 && this.selectedValue1) ? `${this.selectedValue1.country.toUpperCase()} vs ${this.selectedValue2.country.toUpperCase()}` : ''} Data of COVID-19`,
      type : 'LineChart',
      data : this.dataTable,
      columns : ['Date' , this.selectedValue1.country, this.selectedValue2.country],
      options : {
        height: this.graphHeight,
        width: this.countryChart.nativeElement.offsetWidth,
        animation: {
          duration: 1000,
          easing: 'out',
        },
        is3D: true
      },
      height: this.graphHeight,
      width: this.countryChart.nativeElement.offsetWidth - 10,
    };

  }

  selectedValueChange(selectedValue: IGlobalData) {
    this.updateChart();
  }
}
