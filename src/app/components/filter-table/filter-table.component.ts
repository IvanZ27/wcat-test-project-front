import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {FilterModel} from "../../../models/FilterModel";
import {FilterService} from "../../services/filter-model.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-filter-table',
  templateUrl: './filter-table.component.html',
  styleUrls: ['./filter-table.component.css']
})
export class FilterTableComponent implements OnInit {
  @ViewChild(MatTable) matTable: MatTable<string[]> | undefined;

  filter: MatTableDataSource<FilterModel> = new MatTableDataSource<FilterModel>();
  // private readonly allFilters: FilterModel[] = [];
  allFilters: FilterModel[] = [];

  private filterUpdateSubscription: Subscription | undefined;

  constructor(private filterService: FilterService) {
  }


  ngOnInit(): void {
    this.allFilters = this.filterService.getData();
    this.filterUpdateSubscription = this.filterService.dataUpdateSignal.subscribe(x => {
      this.allFilters = this.filterService.allFilters;
      console.log(this.allFilters)

      this.renderTable();
    });
  }

  // getAllFilters(): void {
  //   this.filterService.getFilters().subscribe(
  //     allFilters => {
  //       allFilters.forEach(data => this.allFilters.push(data));
  //       this.filter.data = this.allFilters;
  //     });
  // }

  renderTable(): void {
    this.matTable?.renderRows();
  }

  displayedColumns = ['filterName', 'criteria', 'condition', 'value', 'selection'];
}
