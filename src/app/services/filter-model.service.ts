import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {FilterModel, FilterModelData} from "../../models/FilterModel";
import {map, Observable, Subject} from "rxjs";
import {environment} from "../../environments/environment";


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

const filterUrl = `${environment.apiPath}/filter`;

@Injectable({
  providedIn: 'root'
})


export class FilterModelService {

  allFilters: FilterModel[] = [];
  dataUpdateSignal: Subject<number> = new Subject();

  constructor(private http: HttpClient) {
  }

  getData(): FilterModel[] {
    this.getFilters().subscribe(filters => {
      this.allFilters = filters;
      this.allFilters.sort((a, b) => a.id != undefined && b.id != undefined
        ? a.id - b.id : 0);
      this.dataUpdateSignal.next(1);
    });
    return this.allFilters;
  }

  getFilters(): Observable<FilterModel[]> {
    return this.http.get<FilterModel[]>(filterUrl);
  }

  addFiltersToFiltersTable(filterModel: FilterModel[]):
    Observable<FilterModel[]> {
    const rawEmployeeProjects = FilterModelService.filtersToRawFilters(filterModel);
    return this.http.post<FilterModelData[]>(`${filterUrl}`, rawEmployeeProjects).pipe(
      map(FilterModelService.rawFilterToFilter));
  }

  private static filtersToRawFilters(filterModel: FilterModel[]):
    FilterModelData[] {
    return filterModel.map((filterModel: FilterModel) =>
      FilterModelService.filterModelTofilterModelData(filterModel));
  }

  private static filterModelTofilterModelData(filterModel: FilterModel): FilterModelData {
    return {
      id: filterModel.id,
      filterName: filterModel.filterName,
      criteriaId: filterModel.criteriaId,
      criteriaName: filterModel.criteriaName,
      conditionId: filterModel.conditionId,
      conditionName: filterModel.conditionName,
      amountValue: filterModel.amountValue,
      titleValue: filterModel.titleValue,
      dateValue: filterModel.dateValue,
      selection: filterModel.selection
    };
  }

  private static rawFilterToFilter(rawFilters: FilterModelData[]):
    FilterModel[] {
    return rawFilters.map((rawFilters: FilterModelData) =>
      FilterModelService.filterModelDataTofilterModel(rawFilters));
  }

  private static filterModelDataTofilterModel(rawFilters: FilterModelData): FilterModel {
    return {
      id: rawFilters.id,
      filterName: rawFilters.filterName,
      criteriaId: rawFilters.criteriaId,
      criteriaName: rawFilters.criteriaName,
      conditionId: rawFilters.conditionId,
      conditionName: rawFilters.conditionName,
      amountValue: rawFilters.amountValue,
      titleValue: rawFilters.titleValue,
      dateValue: rawFilters.dateValue,
      selection: rawFilters.selection
    };
  }
  // addFiltersToFiltersTable(filterDTO: FilterModel | undefined): Observable<FilterModel> {
  //   return this.http.post<FilterModel>(filterUrl, filterDTO, httpOptions);
  // }
}
