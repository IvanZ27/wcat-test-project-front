import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {FilterModel} from "../../../models/FilterModel";
import {CriteriaModel} from "../../../models/CriteriaModel";
import {ConditionModel} from "../../../models/ConditionModel";
import {Subscription} from "rxjs";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter
} from "@angular/material-moment-adapter";


@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
  ]
})

export class FilterModalComponent implements OnInit, OnDestroy {

  isValidMoment: boolean = false;

  defaultAmount: number = 1;

  selectList: SelectModel[] = [
    {"id": 1, "selectText": "Select 1"},
    {"id": 2, "selectText": "Select 2"},
    {"id": 3, "selectText": "Select 3"}
  ];

  private readonly filterNameControl = new FormControl(this.data.filter.filterName, Validators.required);
  allConditions: ConditionModel[] = [];

  formArray = new FormArray([
    this.createFilterFormGroup()
  ]);
  formArrayControls: FormGroup[] = (this.formArray.controls as FormGroup[]);

  addFilterForm = new FormGroup({
    filterName: this.filterNameControl,
    formArray: this.formArray,
    selection: new FormControl(this.data.filter.selection)
  });

  isFormValid = false;
  valueChangesSubscription: Subscription | undefined;

  constructor(@Inject(MAT_DIALOG_DATA,) public data: {
    filter: FilterModel,
    criteria: CriteriaModel[],
    conditions: ConditionModel[]
  }) {
  }

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

  private createFilterFormGroup(): FormGroup {
    return new FormGroup({
      criteriaId: new FormControl(this.defaultAmount),
      criteriaName: new FormControl(this.data.filter.criteriaName),
      conditionId: new FormControl(this.data.filter.conditionId),
      conditionName: new FormControl(this.data.filter.conditionName),
      amountValue: new FormControl(this.data.filter.amountValue),
      titleValue: new FormControl(this.data.filter.titleValue),
      dateValue: new FormControl(this.data.filter.dateValue)
    })
  }

  onAddFilterLine(): void {
    this.formArrayControls.push(this.createFilterFormGroup());
    this.isFormValid = false;
    this.buildNewForm();
  }

  getConditions(i: number): any {
    let conditions: ConditionModel[] = [];
    conditions = this.data.conditions.filter(activity => (activity.criteriaId == this.formArrayControls[i].get('criteriaId')?.value));
    return conditions;
  }

  valueCondition(i: number): number {
    let valueCondition: number = this.formArrayControls[i].get('criteriaId')?.value;
    return valueCondition;
  }

  public onRemoveFilterLine(i: number) {
    if (this.formArrayControls.length > 1) {
      this.formArrayControls.splice(i, 1);
    }
  }

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
