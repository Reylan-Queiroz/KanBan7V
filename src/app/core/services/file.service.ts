
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from 'src/app/shared/utils/constants.util';
import { CrudInterface } from '../../shared/interfaces/crud-interface';

@Injectable({
   providedIn: 'root'
})
export class FileService implements CrudInterface {

   constructor(private http: HttpClient) { }

   create(obj: any) {
      return this.http.post(`${Constants.api}/FileManager`, obj);
   }

   getAll() {
      return this.http.get(`${Constants.api}/FileManager`);
   }

   getById(id: number) {
      return this.http.get(`${Constants.api}/FileManager/${id}`);
   }

   update(id: number, obj: any) {
      return this.http.put(`${Constants.api}/FileManager/${id}`, obj);
   }

   delete(id: number) {
      return this.http.delete(`${Constants.api}/FileManager/${id}`);
   }
}
