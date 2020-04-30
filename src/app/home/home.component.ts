import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../data.service';
import {IGlobalData} from '../model/global-data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  graphWidth= 500;
  graphHeight = 500;
  selectedType: string;
  @ViewChild('countryChart', {static: true}) countryChart;
  @ViewChild('globalDataChart', {static: true}) globalDataChart;
  constructor(private dataService: DataService) {}
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  globalDataArray: IGlobalData[] = [];
  dataTable = [];
  dataTableForGlobalChart = [];
  public chartForGlobaldata: any;
  public chartForCountriesData: any;
  public chartForType: any;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.graphHeight = 500;
    if(event.target.innerWidth < 761){
      this.graphHeight = 300;
      this.graphWidth = event.target.innerWidth - 10;
    }
  }
  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe(
      data => {
        this.globalDataArray = Object.values(data).filter(v => !!v.country) as IGlobalData[];
        Object.values(data)
        .forEach(cs => {
          if (cs.country !== undefined) {
            // tslint:disable-next-line:radix
            this.totalActive = this.totalActive + parseInt(String(cs.active));
            // tslint:disable-next-line:radix
            this.totalConfirmed += parseInt(String(cs.confirmed));
            // tslint:disable-next-line:radix
            this.totalDeaths += parseInt(String(cs.deaths));
            // tslint:disable-next-line:radix
            this.totalRecovered += parseInt(String(cs.recovered));
          }
        });
        this.initChart('confirmed');
      }
    );
  }
  initChart(type: string) {
    this.dataTable = [];
    this.dataTableForGlobalChart = [];
    this.globalDataArray.forEach(v => {
      if (v[type] > 5000) {
        this.dataTable.push([v.country, Math.abs(v[type])]);
      }
    });

    this.chartForType = {
      title: 'Country Wise Data of COVID-19',
      type : 'ColumnChart',
      data : this.dataTable,
      columns : ['Country', 'Cases'],
      options : {
        height: this.graphHeight,
        width: this.countryChart.nativeElement? this.countryChart.nativeElement.offsetWidth : 500,
        animation: {
          duration: 1000,
          easing: 'out',
        },
        is3D: true
      },
      heightValue: this.graphHeight,
      widthValue: this.countryChart.nativeElement? this.countryChart.nativeElement.offsetWidth : 500
    };

    this.dataTableForGlobalChart = [
        ['Confirmed', this.totalConfirmed],
        ['Recovered', this.totalRecovered],
        ['Deaths', this.totalDeaths],
        ['Active', this.totalActive]
      ];

    this.chartForCountriesData = {
      title: 'Country Wise Data of COVID-19',
      type : 'PieChart',
      data : this.dataTable,
      columns : ['Country', 'Cases'],
      options : {
        animation: {
          duration: 1000,
          easing: 'out',
        },
        is3D: true
      },
      height: this.graphHeight,
      width: this.globalDataChart.nativeElement ? this.globalDataChart.nativeElement.offsetWidth : 500
    };

    this.chartForGlobaldata = {
      title: 'Global Data of COVID-19',
      type : 'PieChart',
      data : this.dataTableForGlobalChart,
      columns : ['Global', 'Cases'],
      options : {
        animation: {
          duration: 1000,
          easing: 'out',
        },
        is3D: true
      },
      height: this.graphHeight,
      width: this.globalDataChart.nativeElement ? this.globalDataChart.nativeElement.offsetWidth : 500
    };

  }

  updateChart(type: string) {
    this.selectedType = type;
    this.initChart(type);
  }
}
