import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { CountriesComponent } from './countries/countries.component';
import { HttpClientModule } from "@angular/common/http";
import { StatesDashboardComponent } from './states-dashboard/states-dashboard.component';
import {FormsModule} from '@angular/forms';
import { GoogleChartsModule } from 'angular-google-charts';
import { ComparisonComponent } from './comparison/comparison.component';
@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    CountriesComponent,
    StatesDashboardComponent,
    ComparisonComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        GoogleChartsModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
