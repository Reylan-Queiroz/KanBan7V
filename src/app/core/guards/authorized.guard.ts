import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Security } from 'src/app/shared/utils/security.util';

@Injectable({
   providedIn: 'root'
})
export class AuthorizedGuard implements CanActivate {
   constructor(private router: Router) { }

   canActivate() {
      const token = Security.getToken();
      if (!token) {
         this.router.navigate(['/login']);
         return false;
      }

      return true;
   }
}
