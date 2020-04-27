import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { IGlobalData } from '../model/global-data';
import {GoogleChartInterface} from 'ng2-google-charts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private dataService: DataService) {}
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  globalDataArray: IGlobalData[] = [];
  pieChart: GoogleChartInterface = {
    chartType: "PieChart",

  };
  pieChart2: GoogleChartInterface = {
    chartType: "PieChart"
  };
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
            this.totalRecovered += parseInt(String(cs.active));
          }
        });
        this.initChart();
      }
    );
  }
  initChart() {
    const dataTable = [];
    dataTable.push(["Country", "Cases"]);
    this.globalDataArray.forEach(v => {dataTable.push([v.country, Math.abs(v.confirmed)])});
    this.pieChart = {
      chartType: 'PieChart',
      dataTable: dataTable,
      options: {"Country": "Cases", height: 500, is3D: true,},
    };
    console.log(dataTable);


    this.pieChart2 = {
      chartType: 'PieChart',
      dataTable: [
        ["Global", "Cases"],
        ["Confirmed", this.totalConfirmed],
        ["Recovered", this.totalRecovered]
      ],
      options: {"Global": "Cases",is3D: true,},
    }
  }
}
