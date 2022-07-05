import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';

@Injectable({
   providedIn: 'root'
})
export class PeopleGroupService extends BaseService<any, number> {
   constructor(protected _http: HttpClient) {
      super(_http, `${environment.api.baseUrl}/PeopleGroup`);
   }
}
