import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {environment} from "../../environments/environment";
import {CriteriaModel} from "../../models/CriteriaModel";


const criteriaUrl = `${environment.apiPath}/criteria`;

@Injectable({
  providedIn: 'root'
})


export class CriteriaModelService {

  criteria: CriteriaModel[] = [];
  dataUpdateSignal: Subject<number> = new Subject();

  constructor(private http: HttpClient) {
  }

  getData(): CriteriaModel[] {
    this.getCriteria().subscribe(criteria => {
      this.criteria = criteria;
      this.criteria.sort((a, b) => a.id != undefined && b.id != undefined
        ? a.id - b.id : 0);
      this.dataUpdateSignal.next(1);
    });
    return this.criteria;
  }

  getCriteria(): Observable<CriteriaModel[]> {
    return this.http.get<CriteriaModel[]>(criteriaUrl);
  }
}
