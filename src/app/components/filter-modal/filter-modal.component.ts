import {Component, Inject, Injectable, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
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

  private readonly filterNameControl = new FormControl(this.data.filter.filterName, Validators.required);
  allConditions: ConditionModel[] = [];

  formArray = new FormArray([
    this.createEmailFormGroup()
  ]);
  formArrayControls: FormGroup[] = (this.formArray.controls as FormGroup[]);


  addFilterForm = new FormGroup({
    filterName: this.filterNameControl,
    formArray: this.formArray,
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
  }

  ngOnDestroy(): void {
    this.valueChangesSubscription?.unsubscribe();
  }

  validateForm(): number[] {
    this.isFormValid = !this.addFilterForm.invalid;
    if (!this.isFormValid) {
      return [];
    }

    const filterName = FilterModalComponent.filterNameFromFormGroup(this.addFilterForm);
    if (filterName == undefined) {
      this.isFormValid = false;
      return [];
    }
    return [];
  }

  saveFormValues(): FilterModel[] {
    this.validateForm();
    if (!this.isFormValid) {
      return [];
    }
    const filterModels: FilterModel[] = [];
    const filterName = FilterModalComponent.filterNameFromFormGroup(this.addFilterForm);
    const selection = FilterModalComponent.selectionNameFromFormGroup(this.addFilterForm);

    for (let i = 0; i < this.formArrayControls.length; i++) {
      const criteriaId = FilterModalComponent.criteriaIdFromFormGroup(this.formArrayControls[i]);
      const conditionId = FilterModalComponent.conditionIdFromFormGroup(this.formArrayControls[i]);
      const amountValue = FilterModalComponent.amountValueFromFormGroup(this.formArrayControls[i]);
      const titleValue = FilterModalComponent.titleValueFromFormGroup(this.formArrayControls[i]);
      const dateValue = FilterModalComponent.dateValueFromFormGroup(this.formArrayControls[i]);
      const criteriaName = FilterModalComponent.criteriaNameFromFormGroup(this.formArrayControls[i]);
      const conditionName = FilterModalComponent.conditionNameFromFormGroup(this.formArrayControls[i]);

      const filterModel: FilterModel = {
        filterName, criteriaId, criteriaName, conditionId,
        conditionName, amountValue, titleValue, dateValue, selection
      };
      filterModels.push(filterModel);
    }
    console.log("filterModels: " + JSON.stringify(filterModels))
    return filterModels;
  }

  onChange(ev: MatSelectChange) {
    let optionText = (ev.source.selected as MatOption).value;
    this.allConditions = this.data.conditions.filter(activity => (activity.criteriaId == optionText));
  }

  private createEmailFormGroup(): FormGroup {
    return new FormGroup({
      criteriaId: new FormControl(this.data.filter.criteriaId),
      criteriaName: new FormControl(this.data.filter.criteriaName),
      conditionId: new FormControl(this.data.filter.conditionId),
      conditionName: new FormControl(this.data.filter.conditionName),
      amountValue: new FormControl(this.data.filter.amountValue),
      titleValue: new FormControl(this.data.filter.titleValue),
      dateValue: new FormControl(this.data.filter.dateValue)
    })
  }

  onAddFilterLine(): void {
    this.formArrayControls.push(this.createEmailFormGroup());
    this.isFormValid = false;
    this.buildNewForm();
  }

  // onRemoveFilterLine(i: number): void {
  //   this.addFilterForm.removeControl(i);
  // }

  private buildNewForm(): void {
    this.valueChangesSubscription?.unsubscribe();
    this.formArray = new FormArray(this.formArray.controls);
    this.formArrayControls = (this.formArray.controls as FormGroup[]);

    this.addFilterForm = new FormGroup({
      filterName: this.filterNameControl,
      formArray: this.formArray,
      selection: new FormControl(this.data.filter.selection)
    });
    this.valueChangesSubscription = this.addFilterForm.valueChanges.subscribe(x => {
      this.validateForm();
    });
  }


  private static filterNameFromFormGroup(control: FormGroup): string {
    return control.controls['filterName'].value;
  }

  private static selectionNameFromFormGroup(control: FormGroup): number {
    return control.controls['selection'].value;
  }

  private static criteriaIdFromFormGroup(control: FormGroup): number {
    return control.controls['criteriaId'].value;
  }

  private static conditionIdFromFormGroup(control: FormGroup): number {
    return control.controls['conditionId'].value;
  }

  private static amountValueFromFormGroup(control: FormGroup): number {
    return control.controls['amountValue'].value;
  }

  private static titleValueFromFormGroup(control: FormGroup): string {
    return control.controls['titleValue'].value;
  }

  private static dateValueFromFormGroup(control: FormGroup): Date {
    return control.controls['dateValue'].value;
  }

  private static criteriaNameFromFormGroup(control: FormGroup): string {
    return control.controls['criteriaName'].value;
  }

  private static conditionNameFromFormGroup(control: FormGroup): string {
    return control.controls['conditionName'].value;
  }


}


export interface SelectModel {
  id?: number,
  selectText: string
}
