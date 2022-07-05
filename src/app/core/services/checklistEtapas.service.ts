import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CheckListEtapa } from 'src/app/shared/models/checkListEtapa';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';

@Injectable({
   providedIn: 'root'
})
export class ChecklistEtapasService extends BaseService<CheckListEtapa, number> {
   constructor(protected _http: HttpClient) {
      super(_http, `${environment.api.baseUrl}/ChecklistEtapas`);
   }
}
