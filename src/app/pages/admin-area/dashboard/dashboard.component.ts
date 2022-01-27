
import { User } from './../../../shared/models/user';
import { UserService } from './../../../core/services/user.service';
import { PeopleService } from 'src/app/core/services/people.service';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material';
import { AddUserComponent } from 'src/app/shared/components/dialogs/user/add-user/add-user.component';

@Component({
   selector: 'app-dashboard',
   templateUrl: './dashboard.component.html',
   styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
   private wasChanged = new BehaviorSubject<boolean>(false);

   displayedColumns = ['position', 'name', 'login', 'password'];
   dataSource: any[] = [];

   constructor(
      private _peopleService: PeopleService,
      private _userService: UserService,

      private _matDialog: MatDialog,
   ) { }

   async ngOnInit() {
      await this.loadData();

      this.wasChanged.subscribe(async changed => changed === true ? await this.loadData() : '');
   }

   private async loadData() {
      let peoples: any[] = [];
      let users: any[] = [];

      await this._peopleService.getAll()
         .toPromise()
         .then((response: any) => {
            peoples = (response || []);
         })
         .catch(error => console.log(error));

      await this._userService.getAll()
         .toPromise()
         .then((response: any) => {
            users = (response || []);
         })
         .catch(error => console.log(error));

      users.forEach((user: User) => user.people = peoples.find(el => el.id === user.peopleId));

      this.dataSource = users;
   }

   openAddUserDialog(){
      const dialog = this._matDialog.open(AddUserComponent, {
         width: '350px',
         height: 'auto',
         position: { top: '40px' },
      });
   }
}
