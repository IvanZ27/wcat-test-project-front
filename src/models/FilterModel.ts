export interface FilterModel {
  id?: number,
  filterName: string,
  criteriaId: number,
  criteriaName: string,
  conditionId: number,
  conditionName: string,
  amountValue?: number,
  titleValue?: string,
  dateValue?: Date,
  selection: number
}

export type FilterModelData = {
  id?: number,
  filterName: string,
  criteriaId: number,
  criteriaName: string,
  conditionId: number,
  conditionName: string,
  amountValue: number,
  titleValue: string,
  dateValue: Date,
  selection: number
}
