import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
   providedIn: 'root'
})
export class DataService {
   constructor(private http: HttpClient) { }

   get() {
      return this.http.get<any>(`${environment.api.baseUrl}/Kanban`);
   }
}
