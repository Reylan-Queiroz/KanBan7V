
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Column } from 'src/app/shared/models/column';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';

@Injectable({
   providedIn: 'root'
})
export class ColumnService extends BaseService<Column, number> {
   constructor(protected _http: HttpClient) {
      super(_http, `${environment.api.baseUrl}/Column`);
   }
}
