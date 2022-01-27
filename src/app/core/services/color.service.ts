import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudInterface } from '../../shared/interfaces/crud-interface';
import { Constants } from 'src/app/shared/utils/constants.util';
import { Color } from 'src/app/shared/models/color';

@Injectable({
   providedIn: 'root'
})
export class ColorService implements CrudInterface {

   constructor(private http: HttpClient) { }

   create(obj: any) {
      return this.http.post(`${Constants.api}/Color/Create`, obj);
   }

   getAll() {
      return this.http.get<Observable<Color[]>>(`${Constants.api}/Color`)
   }

   getById(id: number) {
      return this.http.get(`${Constants.api}/Color/${id}`)
   }

   update(id: number, obj: any) {
      throw new Error('Method not implemented.');
   }

   delete(id: number) {
      throw new Error('Method not implemented.');
   }
}
