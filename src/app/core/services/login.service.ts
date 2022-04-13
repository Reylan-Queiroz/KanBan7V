import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
   providedIn: 'root'
})
export class LoginService {
   constructor(private http: HttpClient) { }

   authenticate(obj: any) {
      return this.http.post(`${environment.api}/user/login`, obj);
   }

   // refreshToken() {
   //    return this.http.post(`${environment.api}/user/refresh-token`, null, { headers: this.composeHeaders() });
   // }

   // private composeHeaders() {
   //    const token = localStorage.getItem(environment.kanbanToken);
   //    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`);

   //    return headers;
   // }
}
