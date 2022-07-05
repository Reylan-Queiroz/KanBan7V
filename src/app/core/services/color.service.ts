import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Color } from 'src/app/shared/models/color';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';

@Injectable({
   providedIn: 'root'
})
export class ColorService extends BaseService<Color, number> {
   constructor(protected _http: HttpClient) {
      super(_http, `${environment.api.baseUrl}/Color`);
   }
}
