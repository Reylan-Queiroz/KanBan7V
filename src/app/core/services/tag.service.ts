import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tag } from 'src/app/shared/models/tag';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';

@Injectable({
   providedIn: 'root'
})
export class TagService extends BaseService<Tag, number> {
   constructor(protected _http: HttpClient) {
      super(_http, `${environment.api.baseUrl}/Tag`);
   }
}
