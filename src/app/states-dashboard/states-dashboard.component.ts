import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-states-dashboard',
  templateUrl: './states-dashboard.component.html',
  styleUrls: ['./states-dashboard.component.css']
})
export class StatesDashboardComponent implements OnInit {
@Input() confirmed: number;
  @Input() active: number;
  @Input() deaths: number;
  @Input() recovered: number;
  constructor() { }

  ngOnInit(): void {
  }

}
