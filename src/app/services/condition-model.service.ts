import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {environment} from "../../environments/environment";
import {ConditionModel} from "../../models/ConditionModel";


const conditionUrl = `${environment.apiPath}/condition`;

@Injectable({
  providedIn: 'root'
})


export class ConditionModelService {


  constructor(private http: HttpClient) {
  }



  getCondition(): Observable<ConditionModel[]> {
    return this.http.get<ConditionModel[]>(conditionUrl);
  }
}
