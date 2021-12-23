
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstants } from '../helpers/global-constants';

@Injectable({
   providedIn: 'root'
})
export class ColumnsAndTicketsService {

   constructor(private http: HttpClient) { }

   get() {
      return this.http.get<any>(`${GlobalConstants.apiUrl}/Kanban`);
   }
}
