import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {environment} from "../../environments/environment";
import {ConditionModel} from "../../models/ConditionModel";


// const httpOptions = {
//   headers: new HttpHeaders({
//     'Content-Type': 'application/json'
//   })
// };

const conditionUrl = `${environment.apiPath}/condition`;

@Injectable({
  providedIn: 'root'
})


export class ConditionModelService {

  condition: ConditionModel[] = [];
  dataUpdateSignal: Subject<number> = new Subject();

  constructor(private http: HttpClient) {
  }

  getData(): ConditionModel[] {
    this.getCondition().subscribe(condition => {
      this.condition = condition;
      this.condition.sort((a, b) => a.id != undefined && b.id != undefined
        ? a.id - b.id : 0);
      this.dataUpdateSignal.next(1);
    });
    return this.condition;
  }

  getCondition(): Observable<ConditionModel[]> {
    return this.http.get<ConditionModel[]>(conditionUrl);
  }
}
