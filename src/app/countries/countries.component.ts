import { Component, OnInit } from '@angular/core';
import {DataService} from '../data.service';
import {IGlobalData} from '../model/global-data';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {
countriesList: IGlobalData[];
  selectedValue: IGlobalData;
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe(
      data => {
        this.countriesList = Object.values(data).filter(v => !!v.country) as IGlobalData[];
        this.selectedValue = this.countriesList[0];
      }
    )
  }
}
