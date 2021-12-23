import { Column } from 'src/app/models/column';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudInterface } from '../interfaces/crud-interface';
import { GlobalConstants } from '../helpers/global-constants';

@Injectable({
   providedIn: 'root'
})
export class ColumnService implements CrudInterface {

   constructor(private http: HttpClient) { }

   create(obj: any) {
      return this.http.post<Column>(`${GlobalConstants.apiUrl}/Column/Create`, obj);
   }

   getAll() {
      return this.http.get<Column>(`${GlobalConstants.apiUrl}/Column`);
   }

   getById(id: number) {
      return this.http.get<Column>(`${GlobalConstants.apiUrl}/Column/${id}`);
   }

   update(id: number, obj: any) {
      return this.http.put<Column>(`${GlobalConstants.apiUrl}/Column/${id}`, obj);
   }

   delete(id: number) {
      return this.http.delete<Column>(`${GlobalConstants.apiUrl}/Column/${id}`);
   }
}
