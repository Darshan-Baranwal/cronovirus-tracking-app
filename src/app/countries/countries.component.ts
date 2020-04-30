import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../data.service';
import {IGlobalData} from '../model/global-data';
import {DatewiseData} from '../model/datewise-data';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {
  @ViewChild('countryChart', {static: true}) countryChart
  graphWidth= 500;
  graphHeight = 500;
countriesList: IGlobalData[];
  selectedValue: IGlobalData;
  countriesData: {[country: string]: DatewiseData[]};
  countryData: DatewiseData[];
  dataTable: any[];
  chartForCountry: any;
  constructor(private dataService: DataService) { }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.graphWidth = this.countryChart.nativeElement.offsetWidth - 10;
    this.graphHeight = 500;
    if(event.target.innerWidth < 761){
      this.graphHeight = 300;
    }
  }
  ngOnInit(): void {
    this.dataService.getDateWiseDate().subscribe(
      data => {this.countriesData = data; console.log(data); this.countryData = data.US; this.updateChart(); }
    );
    this.dataService.getGlobalData().subscribe(
      data => {
        this.countriesList = Object.values(data).filter(v => !!v.country) as IGlobalData[];
        this.selectedValue = this.countriesList[0];
      }
    );
  }
  updateChart() {
    this.dataTable = [];
    this.countryData.forEach((cs) => {
      this.dataTable.push([cs.date , cs.case]);
    });
    this.chartForCountry = {
      title: `${this.selectedValue ? this.selectedValue.country.toUpperCase() : ''} Data of COVID-19`,
      type : 'LineChart',
      data : this.dataTable,
      columns : ['Date' , 'Cases'],
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
      width: this.countryChart.nativeElement.offsetWidth,
    };
  }

  selectedValueChange(selectedValue: IGlobalData) {
    this.countryData = this.countriesData[selectedValue.country];
    this.updateChart();
  }

  getDate(d: Date) {
    return (d.getMonth() < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '-' + (d.getDate() - 1) + '-' + d.getFullYear();
  }
}
