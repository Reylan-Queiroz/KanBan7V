import { RoleService } from './../../../../../core/services/role.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user';
import { PeopleService } from 'src/app/core/services/people.service';
import { UserService } from './../../../../../core/services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { People } from 'src/app/shared/models/people';
import { Role } from 'src/app/shared/models/role';

@Component({
   selector: 'app-add-user',
   templateUrl: './add-user.component.html',
   styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
   form: FormGroup;
   roles: Observable<Role[]>;

   constructor(
      private _roleService: RoleService,
      private _userService: UserService,
      private _peopleService: PeopleService,

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
            Validators.minLength(3),
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

   private loadData() {
      this._roleService.getAll()
         .subscribe((response) => {
            this.roles = response;
         }, (error) => {
            console.log(error);
         });
   }

   onSubmit(form: FormGroup) {
      this._peopleService.create(form.value)
         .subscribe((response: People) => {
            let user = new User(0, form.value['login'], form.value['password'], form.value['role'], null, response.id, null)

            if (!response) return;

            this.createUser(user);
         }, (error) => {
            console.log(error);
         });
   }

   private createUser(user: User) {
      this._userService.create(user)
         .subscribe((response: any) => {

         }, (error) => {
            console.log(error);
         });
   }

   getErrorMessage() {
      return this.form.controls['name'].hasError('required') ? 'You must enter a value' : this.form.controls['name'].hasError('minLength') ? 'Not a valid email' : '';
   }
}
