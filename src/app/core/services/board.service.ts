import { Observable, ReplaySubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CrudInterface } from '../../shared/interfaces/crud-interface';
import { Injectable } from '@angular/core';
import { Constants } from 'src/app/shared/utils/constants.util';
import { Board } from 'src/app/shared/models/board';

@Injectable({
   providedIn: 'root'
})
export class BoardService implements CrudInterface {
   constructor(private http: HttpClient) { }

   create(obj: any) {
      return this.http.post(`${Constants.api}/Board/Create`, obj);
   }

   getAll() {
      return this.http.get<Observable<Board[]>>(`${Constants.api}/Board`);
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
