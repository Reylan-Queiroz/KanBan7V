
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from 'src/app/shared/utils/constants.util';

@Injectable({
   providedIn: 'root'
})
export class DataService {

   constructor(private http: HttpClient) { }

   get() {
      return this.http.get<any>(`${Constants.api}/Kanban`);
   }
}
