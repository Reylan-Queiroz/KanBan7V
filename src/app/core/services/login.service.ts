
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from 'src/app/shared/utils/constants.util';

@Injectable({
   providedIn: 'root'
})
export class LoginService {
   constructor(private http: HttpClient) { }

   authenticate(obj: any) {
      return this.http.post(`${Constants.api}/user/login`, obj);
   }

   refreshToken() {
      return this.http.post(`${Constants.api}/user/refresh-token`, null, { headers: this.composeHeaders() });
   }

   private composeHeaders() {
      const token = localStorage.getItem(Constants.kanbanToken);
      const headers = new HttpHeaders().set('Authorization', `bearer ${token}`);

      return headers;
   }
}
