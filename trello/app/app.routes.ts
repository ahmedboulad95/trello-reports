import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { GraphsComponent } from './graphs/graphs.component';
import { TeamComponent } from './team/team.component';
import { BugsComponent } from './bugs/bugs.component';

export const router: Routes = [
  { path: '', redirectTo: 'graphs', pathMatch: 'full'},
  { path: 'graphs', component: GraphsComponent },
  { path: 'team', component: TeamComponent },
  { path: 'bugs', component: BugsComponent }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
