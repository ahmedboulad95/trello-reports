
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { GraphsComponent } from './graphs/graphs.component';
import { TeamComponent } from './team/team.component';
import { BugsComponent } from './bugs/bugs.component';

import { routes } from './app.routes';

@NgModule({
    imports:      [ BrowserModule, FormsModule, ChartsModule, routes ],
    declarations: [ AppComponent, GraphsComponent, TeamComponent, BugsComponent ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }
