import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Security } from 'src/app/shared/utils/security.util';

@Injectable({
   providedIn: 'root'
})
export class ManagerGuard implements CanActivate {
   constructor() { }

   canActivate() {
      return Security.isInRole('manager');
   }
}
