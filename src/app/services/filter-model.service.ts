import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {FilterModel} from "../../models/FilterModel";
import {Observable, Subject} from "rxjs";
import {environment} from "../../environments/environment";


// const httpOptions = {
//   headers: new HttpHeaders({
//     'Content-Type': 'application/json'
//   })
// };

const filterUrl = `${environment.apiPath}/filter`;

@Injectable({
  providedIn: 'root'
})


export class FilterService {

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
}
