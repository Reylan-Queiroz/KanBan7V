import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Security } from 'src/app/shared/utils/security.util';

@Component({
   selector: 'app-navbar-dashboard',
   templateUrl: './navbar-dashboard.component.html',
   styleUrls: ['./navbar-dashboard.component.scss']
})
export class NavbarDashboardComponent implements OnInit {

   constructor(private _router: Router) { }

   ngOnInit() {
   }

   logout() {
      Security.clear();
      this._router.navigate(['/login']);
   }
}
