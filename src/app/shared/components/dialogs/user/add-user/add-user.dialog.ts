import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { PeopleService } from 'src/app/core/services/people.service';
import { Role } from 'src/app/shared/enums/role.enum';
import { People } from 'src/app/shared/models/people';
import { RoleModel } from 'src/app/shared/models/RoleModel';
import { Security } from 'src/app/shared/utils/security.util';
import { RoleService } from './../../../../../core/services/role.service';
import { UserService } from './../../../../../core/services/user.service';

@Component({
   selector: 'app-add-user',
   templateUrl: './add-user.dialog.html',
   styleUrls: ['./add-user.dialog.scss']
})
export class AddUserDialog implements OnInit {
   roles: RoleModel[] = [];
   form: FormGroup;

   constructor(
      private _roleService: RoleService,
      private _userService: UserService,
      private _peopleService: PeopleService,

      private _dialogRef: MatDialogRef<AddUserDialog>,
      private _fb: FormBuilder
   ) {
      this.form = this._fb.group({
         name: ['', Validators.compose([
            Validators.minLength(3),
            Validators.required
         ])],
         login: ['', Validators.compose([
            Validators.minLength(3),
            Validators.required
         ])],
         role: ['', Validators.compose([
            Validators.required
         ])]
      });
   }

   async ngOnInit() {
      await this.loadData();
   }

   private async loadData() {
      await this._roleService.getAll()
         .toPromise()
         .then((res: any) => {
            this.roles = res;
         }).catch(err => console.log(err));

      this.roles.splice(0, 1);

      if (Security.getUser().roleId !== Role.Master) {
         this.roles.splice(0, 1);
      }
   }

   onSubmit(form: FormGroup) {
      this._peopleService.create({ id: 0, name: form.value['name'], createdById: Security.getUser().peopleId }).subscribe(
         (response: People) => {
            if (!response) return;

            let user = { id: 0, login: form.value['login'], password: '1', roleId: form.value['role'], peopleId: response.id };

            this._userService.create(user).subscribe(
               () => {
                  this._dialogRef.close('Success!');
               }, (error) => {
                  console.log(error);
               });
         }, (error) => {
            console.log(error);
         });
   }
}
