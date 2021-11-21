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

  hideAmountValue = false;
  hideTitleValue = false;
  hideDateValue = false;

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

  constructor(@Inject(MAT_DIALOG_DATA) public data: { filter: FilterModel, criteria: CriteriaModel[], conditions: ConditionModel[] }) {
  }

  ngOnInit(): void {
    this.valueChangesSubscription = this.addFilterForm.valueChanges.subscribe(x => {
      this.validateForm();
    });
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
      // this.filter.criteriaName = this.addFilterForm.controls['filterName'].value,
      this.data.filter.conditionId = this.addFilterForm.controls['conditionId'].value,
      // this.filter.conditionName = this.addFilterForm.controls['filterName'].value,
      // this.filter.amountValue = this.addFilterForm.controls['filterName'].value,
      // this.filter.titleValue = this.addFilterForm.controls['filterName'].value,
      // this.filter.dateValue = this.addFilterForm.controls['filterName'].value,
      // this.filter.selection = this.addFilterForm.controls['filterName'].value;
      // this.data.filter.criteriaId = 1,
      this.data.filter.criteriaName = '',
      this.data.filter.conditionName = '',
      this.data.filter.amountValue = 245,
      this.data.filter.titleValue = '',
      this.data.filter.dateValue = new Date(''),
      this.data.filter.selection = 1;
    return this.data.filter;
  }

  allConditions: any = [];

  onChange(ev: MatSelectChange) {
    let optionText = (ev.source.selected as MatOption).value;
    this.allConditions = this.data.conditions.filter(activity => (activity.criteriaId == optionText));
  }

  validateForm(): void {
    this.isFormValid = !this.addFilterForm.invalid;
  }
}
