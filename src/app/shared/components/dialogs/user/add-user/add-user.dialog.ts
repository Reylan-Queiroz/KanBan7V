import { Security } from 'src/app/shared/utils/security.util';
import { RoleService } from './../../../../../core/services/role.service';
import { Observable } from 'rxjs';
import { PeopleService } from 'src/app/core/services/people.service';
import { UserService } from './../../../../../core/services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { People } from 'src/app/shared/models/people';
import { MatDialogRef } from '@angular/material';
import { RoleModel } from 'src/app/shared/models/RoleModel';

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
         password: ['', Validators.compose([
            Validators.minLength(1),
            Validators.required
         ])],
         role: ['', Validators.compose([
            Validators.required
         ])]
      });
   }

   ngOnInit() {
      this.loadData();
   }

   private async loadData() {
      await this._roleService.getAll()
         .toPromise()
         .then((res: any) => {
            this.roles = res;
         }).catch(err => console.log(err));

      this.roles.splice(0, 1);
      this.roles.splice(0, 1);
   }

   onSubmit(form: FormGroup) {
      this._peopleService.create({ id: 0, name: form.value['name'], createdById: Security.getUser().peopleId }).subscribe(
         (response: People) => {
            if (!response) return;

            let user = { id: 0, login: form.value['login'], password: form.value['password'], roleId: form.value['role'], peopleId: response.id };

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

   getErrorMessage() {
      return this.form.controls['name'].hasError('required') ? 'You must enter a value' : this.form.controls['name'].hasError('minLength') ? 'Not a valid email' : '';
   }
}
