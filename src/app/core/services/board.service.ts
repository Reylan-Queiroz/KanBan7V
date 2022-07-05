import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Board } from 'src/app/shared/models/board';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';

@Injectable({
   providedIn: 'root'
})
export class BoardService extends BaseService<Board, number> {
   constructor(protected _http: HttpClient) {
      super(_http, `${environment.api.baseUrl}/Board`);
   }
}
