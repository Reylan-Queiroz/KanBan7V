import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { Security } from 'src/app/shared/utils/security.util';

@Component({
   selector: 'app-navbar',
   templateUrl: './navbar.component.html',
   styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
   @Input() drawerReceived;
   loggedUser = Security.getUser();

   constructor(private _router: Router) { }

   logout() {
      Security.clear();
      this._router.navigate(['/login']);
   }
}
