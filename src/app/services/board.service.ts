import { Observable, ReplaySubject, Subject } from 'rxjs';
import { GlobalConstants } from './../helpers/global-constants';
import { HttpClient } from '@angular/common/http';
import { CrudInterface } from './../interfaces/crud-interface';
import { Injectable } from '@angular/core';
import { Board } from '../models/board';

@Injectable({
   providedIn: 'root'
})
export class BoardService implements CrudInterface {
   constructor(private http: HttpClient) { }

   create(obj: any) {
      return this.http.post(`${GlobalConstants.apiUrl}/Board/Create`, obj);
   }

   getAll() {
      return this.http.get<Observable<Board[]>>(`${GlobalConstants.apiUrl}/Board`);
   }

   getById(id: number) {
      throw new Error('Method not implemented.');
   }

   update(id: number, obj: any) {
      throw new Error('Method not implemented.');
   }

   delete(id: number) {
      throw new Error('Method not implemented.');
   }
}
