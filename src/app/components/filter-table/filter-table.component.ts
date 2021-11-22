import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTable} from "@angular/material/table";
import {FilterModel} from "../../../models/FilterModel";
import {FilterModelService} from "../../services/filter-model.service";
import {Subscription} from "rxjs";
import {CriteriaModelService} from "../../services/criteria-model.service";
import {CriteriaModel} from "../../../models/CriteriaModel";
import {ConditionModel} from "../../../models/ConditionModel";
import {ConditionModelService} from "../../services/condition-model.service";
import {FilterModalComponent} from "../filter-modal/filter-modal.component";
import {MatDialog} from "@angular/material/dialog";
import * as moment from "moment";


@Component({
  selector: 'app-filter-table',
  templateUrl: './filter-table.component.html',
  styleUrls: ['./filter-table.component.css']
})
export class FilterTableComponent implements OnInit {
  @ViewChild(MatTable) matTable: MatTable<string[]> | undefined;

  allFilters: FilterModel[] = [];
  criteria: CriteriaModel[] = [];
  conditions: ConditionModel[] = [];


  private filterUpdateSubscription: Subscription | undefined;
  private criteriaUpdateSubscription: Subscription | undefined;
  private conditionUpdateSubscription: Subscription | undefined;

  displayedColumns = ['filterName', 'criteria', 'condition', 'value', 'selection'];

  constructor(private filterService: FilterModelService,
              private criteriaService: CriteriaModelService,
              private conditionService: ConditionModelService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.allFilters = this.filterService.getData();
    this.criteria = this.criteriaService.getData();
    this.conditions = this.conditionService.getData();

    this.filterUpdateSubscription = this.filterService.dataUpdateSignal.subscribe(x => {
      this.allFilters = this.filterService.allFilters;
      console.log(this.allFilters)
      this.renderTable();
    });

    this.criteriaUpdateSubscription = this.criteriaService.dataUpdateSignal.subscribe(x => {
      this.criteria = this.criteriaService.criteria;
    });

    this.conditionUpdateSubscription = this.conditionService.dataUpdateSignal.subscribe(x => {
      this.conditions = this.conditionService.condition;
    });
  }

  renderTable(): void {
    this.matTable?.renderRows();
  }

  getCriteriaName(id: number): string {
    const find = this.criteria.find(criteria => criteria.id == id);
    if (find) {
      return find.criteriaText;
    }
    return '';
  }

  getConditionName(id: number): string {
    const find = this.conditions.find(condition => condition.id == id);
    if (find) {
      return find.conditionText;
    }
    return '';
  }

  onAdd(): void {
    const filter = {filterName: '', criteriaId: 0, criteriaName: '', conditionId: 0, conditionName: '', selection: 0};
    this.openDialog(filter);
  }

  addFiltersToFiltersTable(filtersToFiltersTable: FilterModel[]): void {
    this.filterService.addFiltersToFiltersTable(filtersToFiltersTable).subscribe(newFilters => {
      this.allFilters.push(...newFilters);
      console.log(this.allFilters)

      this.renderTable();
    });
  }

  ngOnDestroy(): void {
    this.matTable = undefined;
    this.filterUpdateSubscription?.unsubscribe();
    this.criteriaUpdateSubscription?.unsubscribe();
    this.conditionUpdateSubscription?.unsubscribe();
  }

  private openDialog(filter: FilterModel): void {
    const dialogRef = this.dialog.open(FilterModalComponent, {
      data: {filter, filters: this.allFilters, conditions: this.conditions, criteria: this.criteria}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addFiltersToFiltersTable(result);
      }
    });
  }

  normalDate(date: Date){
    if(date == null){
      return null;
    }
    return moment(date).format('YYYY.MM.DD');
  }

}


