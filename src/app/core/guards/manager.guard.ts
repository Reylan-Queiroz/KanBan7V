import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Role } from 'src/app/shared/enums/role.enum';
import { Security } from 'src/app/shared/utils/security.util';

@Injectable({
   providedIn: 'root'
})
export class ManagerGuard implements CanActivate {
   constructor(private _router: Router) { }

   canActivate = () => { return Security.isInRole([Role.Management, Role.Master]); }
}
