import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from 'src/app/shared/utils/constants.util';

@Injectable({
   providedIn: 'root'
})
export class ChecklistEtapasService {
   constructor(private http: HttpClient) { }

   create(obj: any) {
      return this.http.post(`${Constants.api}/ChecklistEtapas/Create`, obj);
   }

   getAll() {
      return this.http.get(`${Constants.api}/ChecklistEtapas`);
   }

   getById(id: number) {
      return this.http.get(`${Constants.api}/ChecklistEtapas/${id}`);
   }

   update(id: number, obj: any) {
      return this.http.put(`${Constants.api}/ChecklistEtapas/${id}`, obj);
   }

   delete(id: number) {
      return this.http.delete(`${Constants.api}/ChecklistEtapas/${id}`);
   }
}
