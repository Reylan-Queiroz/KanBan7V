import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RoleModel } from 'src/app/shared/models/RoleModel';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';

@Injectable({
   providedIn: 'root'
})
export class RoleService extends BaseService<RoleModel, number> {
   constructor(protected _http: HttpClient) {
      super(_http, `${environment.api.baseUrl}/Role`);
   }
}
