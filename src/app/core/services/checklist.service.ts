import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Checklist } from 'src/app/shared/models/checklist';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';

@Injectable({
   providedIn: 'root'
})
export class ChecklistService extends BaseService<Checklist, number>{
   constructor(protected _http: HttpClient) {
      super(_http, `${environment.api.baseUrl}/Checklist`);
   }

   createAll(obj: any) {
      return this._http.post(`${environment.api.baseUrl}/Checklist/CreateAll`, obj);
   }
}
