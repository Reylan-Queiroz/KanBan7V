import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { People } from 'src/app/shared/models/people';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';

@Injectable({
   providedIn: 'root'
})
export class PeopleService extends BaseService<People, number> {
   constructor(protected _http: HttpClient) {
      super(_http, `${environment.api.baseUrl}/People`);
   }
}
