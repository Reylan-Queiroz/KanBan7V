import { Component, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { PeopleService } from 'src/app/core/services/people.service';
import { PeopleGroupService } from 'src/app/core/services/peopleGroup.service';
import { fadeInAnimation } from 'src/app/shared/animations/fade-in.animation';
import { AddUserGroupDialog } from 'src/app/shared/components/dialogs/user/add-user-group/add-user-group.dialog';
import { AddUserDialog } from 'src/app/shared/components/dialogs/user/add-user/add-user.dialog';
import { RoleModel } from 'src/app/shared/models/RoleModel';
import { Security } from 'src/app/shared/utils/security.util';
import { GroupService } from '../../../core/services/group.service';
import { PeopleRelationService } from '../../../core/services/peopleRelation.service';
import { RoleService } from '../../../core/services/role.service';
import { UserService } from '../../../core/services/user.service';
import { PeopleGroup } from '../../../shared/models/peopleGroup';
import { User } from '../../../shared/models/user';

@Component({
   selector: 'app-dashboard',
   templateUrl: './dashboard.page.html',
   styleUrls: ['./dashboard.page.scss'],

   animations: [fadeInAnimation],
   host: { '[@fadeInAnimation]': '' }
})
export class DashboardPage implements OnInit {
   private _wasChanged = new BehaviorSubject<boolean>(false);

   @Output() dataSource = { users: [], userGroup: undefined };

   constructor(
      private _matDialog: MatDialog,

      private _peopleService: PeopleService,
      private _userService: UserService,
      private _roleService: RoleService,
      private _groupService: GroupService,
      private _peopleGroupService: PeopleGroupService,
      private _peopleRelationService: PeopleRelationService,
   ) { }

   async ngOnInit() {
      await this._loadData();

      this._wasChanged.subscribe(async changed => changed ? await this._loadData() : '');
   }

   private async _loadData() {
      let peoples: any[] = [];
      let users: any[] = [];
      let roles: RoleModel[] = [];
      let groups: any[] = [];
      let peopleGroupRes: any[] = [];
      let peopleRelations: any[] = [];

      let peopleGroup: PeopleGroup;
      let peopleGroups: PeopleGroup[] = [];

      await this._peopleService.findAll()
         .toPromise()
         .then((response: any) => {
            peoples = (response || []);
         }).catch(error => console.log(error));

      let usersRes;
      await this._userService.findAll()
         .toPromise()
         .then((response: any) => {
            usersRes = (response || []);
         }).catch(error => console.log(error));

      await this._roleService.findAll()
         .toPromise()
         .then((response: any) => {
            roles = (response || []);;
         }).catch(error => console.log(error));

      await this._groupService.findAll()
         .toPromise()
         .then((response: any) => {
            groups = (response || []);;
         }).catch(error => console.log(error));

      await this._peopleGroupService.findAll()
         .toPromise()
         .then((response: any) => {
            peopleGroupRes = (response || []);
         }).catch(error => console.log(error));

      await this._peopleRelationService.findAll()
         .toPromise()
         .then((response: any) => {
            peopleRelations = response;
         }).catch(error => console.log(error));

      peoples = peoples.filter(el => el.createdById === Security.getUser().peopleId);
      peopleGroupRes = peopleGroupRes.filter(el => el.createdById === Security.getUser().peopleId);

      usersRes.forEach((user: User) => {
         if (!peoples.find(el => el.id === user.peopleId)) {
            return;
         }

         user.people = peoples.find(el => el.id === user.peopleId);
         user.role = roles.find(el => el.id === user.roleId);

         users.push(user);
      });

      peopleGroupRes.forEach(element => {
         if (peoples.length === 0) {
            peopleGroupRes = [];
            return;
         }

         element.people = peoples.find(el => el.id === element.peopleId)
      });

      groups.forEach(group => {
         peopleGroup = new PeopleGroup(group.id, group.name, null, null, []);

         peopleGroupRes.forEach(element => {
            if (element.groupId !== peopleGroup.id) return;

            peopleGroup.createdById = element.createdById;
            peopleGroup.peoples.push(element.people);
         });

         if (peopleGroup.peoples.length === 0) {
            return;
         }

         peopleGroups.push(peopleGroup);
      });

      this.dataSource.users = users;
      this.dataSource.userGroup = peopleGroups;
   }

   openAddUserDialog() {
      const dialog = this._matDialog.open(AddUserDialog, {
         width: '350px',
         height: 'auto',
         position: { top: '40px' },
      });

      dialog.afterClosed().subscribe((res) => {
         if (!res) return;

         this._wasChanged.next(true);
      });
   }

   openAddUserGroupDialog() {
      const dialog = this._matDialog.open(AddUserGroupDialog, {
         width: '350px',
         height: 'auto',
         position: { top: '40px' },
      });

      dialog.afterClosed().subscribe((res) => {
         if (!res) return;

         this._wasChanged.next(true);
      });
   }
}
