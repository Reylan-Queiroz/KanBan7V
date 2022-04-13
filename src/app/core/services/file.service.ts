
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CrudInterface } from '../../shared/interfaces/crud-interface';

@Injectable({
   providedIn: 'root'
})
export class FileService implements CrudInterface {

   constructor(private http: HttpClient) { }

   create(obj: any) {
      return this.http.post(`${environment.api}/FileManager`, obj);
   }

   getAll() {
      return this.http.get(`${environment.api}/FileManager`);
   }

   getById(id: number) {
      return this.http.get(`${environment.api}/FileManager/${id}`);
   }

   update(id: number, obj: any) {
      return this.http.put(`${environment.api}/FileManager/${id}`, obj);
   }

   delete(id: number) {
      return this.http.delete(`${environment.api}/FileManager/${id}`);
   }
}
