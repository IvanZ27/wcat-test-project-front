import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {FilterModel} from "../../../models/FilterModel";
import {FilterModelService} from "../../services/filter-model.service";
import {Subscription} from "rxjs";
import {CriteriaModelService} from "../../services/criteria-model.service";
import {CriteriaModel} from "../../../models/CriteriaModel";
import {ConditionModel} from "../../../models/ConditionModel";
import {ConditionModelService} from "../../services/condition-model.service";

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
  criteria: CriteriaModel[] = [];
  conditions: ConditionModel[] = [];


  private filterUpdateSubscription: Subscription | undefined;
  private criteriaUpdateSubscription: Subscription | undefined;
  private conditionUpdateSubscription: Subscription | undefined;



  constructor(private filterService: FilterModelService,
              private criteriaService: CriteriaModelService,
              private conditionService: ConditionModelService) {
  }


  ngOnInit(): void {
    this.allFilters = this.filterService.getData();
    this.criteria = this.criteriaService.getData();
    this.conditions = this.conditionService.getData();



    this.filterUpdateSubscription = this.filterService.dataUpdateSignal.subscribe(x => {
      this.allFilters = this.filterService.allFilters;
      this.renderTable();
    });

    this.criteriaUpdateSubscription = this.criteriaService.dataUpdateSignal.subscribe(x => {
      this.criteria = this.criteriaService.criteria;
    });

    this.conditionUpdateSubscription = this.conditionService.dataUpdateSignal.subscribe(x => {
      this.conditions = this.conditionService.condition;
      console.log(this.conditions)
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

  displayedColumns = ['filterName', 'criteria', 'condition', 'value', 'selection'];
}
