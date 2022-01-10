import { GlobalConstants } from 'src/app/helpers/global-constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
   providedIn: 'root'
})
export class LoginService {

   mockoon: string = 'http://localhost:3000/v1';

   constructor(private http: HttpClient) { }

   authenticate(obj: any) {
      return this.http.post(`${GlobalConstants.apiUrl}/user/login`, obj);
   }

   refreshToken() {
      return this.http.post(`${GlobalConstants.apiUrl}/user/refresh-token`, null, { headers: this.composeHeaders() });
   }

   private composeHeaders() {
      const token = localStorage.getItem(GlobalConstants.kanbanToken);
      const headers = new HttpHeaders().set('Authorization', `bearer ${token}`);

      return headers;
   }
}
