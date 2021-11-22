import {Component, Inject, Injectable, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FilterModel} from "../../../models/FilterModel";
import {CriteriaModel} from "../../../models/CriteriaModel";
import {ConditionModel} from "../../../models/ConditionModel";
import {Subscription} from "rxjs";
import {MatSelectChange} from "@angular/material/select";
import {MatOption} from "@angular/material/core";


@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.css']
})


export class FilterModalComponent implements OnInit, OnDestroy {


  allConditions: ConditionModel[] = [];


  addFilterForm = new FormGroup({
    filterName: new FormControl(this.data.filter.filterName, Validators.required),
    criteriaId: new FormControl(this.data.filter.criteriaId),
    criteriaName: new FormControl(this.data.filter.criteriaName),
    conditionId: new FormControl(this.data.filter.conditionId),
    conditionName: new FormControl(this.data.filter.conditionName),
    amountValue: new FormControl(this.data.filter.amountValue),
    titleValue: new FormControl(this.data.filter.titleValue),
    dateValue: new FormControl(this.data.filter.dateValue),
    selection: new FormControl(this.data.filter.selection)
  });

  isFormValid = false;
  valueChangesSubscription: Subscription | undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    filter: FilterModel,
    criteria: CriteriaModel[],
    conditions: ConditionModel[]
  }) {
  }

  selectList: SelectModel[] = [
    {"id": 1, "selectText": "Select 1"},
    {"id": 2, "selectText": "Select 2"},
    {"id": 3, "selectText": "Select 3"}
  ];
  defaultAmount: number = 1;


  ngOnInit(): void {
    this.valueChangesSubscription = this.addFilterForm.valueChanges.subscribe(x => {
      this.validateForm();
    });
    this.allConditions = this.data.conditions.filter(activity => (activity.criteriaId == 1));

    // this.data.filter.join(':');

  }

  ngOnDestroy(): void {
    this.valueChangesSubscription?.unsubscribe();
  }

  saveFormValues(): FilterModel | undefined {
    this.validateForm();
    if (!this.isFormValid) {
      return undefined;
    }
    this.data.filter.filterName = this.addFilterForm.controls['filterName'].value,
      this.data.filter.criteriaId = this.addFilterForm.controls['criteriaId'].value,
      this.data.filter.conditionId = this.addFilterForm.controls['conditionId'].value,
      this.data.filter.amountValue = this.addFilterForm.controls['amountValue'].value,
      this.data.filter.titleValue = this.addFilterForm.controls['titleValue'].value,
      this.data.filter.dateValue = this.addFilterForm.controls['dateValue'].value,
      this.data.filter.selection = this.addFilterForm.controls['selection'].value,
      this.data.filter.criteriaName = '',
      this.data.filter.conditionName = '';
    console.log(this.data.filter)
    return this.data.filter;
  }

  onChange(ev: MatSelectChange) {
    let optionText = (ev.source.selected as MatOption).value;
    this.allConditions = this.data.conditions.filter(activity => (activity.criteriaId == optionText));
  }

  validateForm(): void {
    this.isFormValid = !this.addFilterForm.invalid;
  }
}


export interface SelectModel {
  id?: number,
  selectText: string
}
