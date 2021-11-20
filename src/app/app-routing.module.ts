import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FilterTableComponent} from "./components/filter-table/filter-table.component";

const routes: Routes = [
  {path: '', component: FilterTableComponent},
  {path: 'filter', component: FilterTableComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
