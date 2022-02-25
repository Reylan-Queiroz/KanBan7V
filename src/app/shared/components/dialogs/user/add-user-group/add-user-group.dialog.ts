import { Security } from './../../../../utils/security.util';
import { PeopleGroupService } from './../../../../../core/services/peopleGroup.service';
import { PeopleService } from 'src/app/core/services/people.service';
import { Observable } from 'rxjs';
import { GroupService } from './../../../../../core/services/group.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { People } from 'src/app/shared/models/people';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent, MatDialogRef } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { map, startWith } from 'rxjs/operators';

@Component({
   selector: 'app-add-user-group',
   templateUrl: './add-user-group.dialog.html',
   styleUrls: ['./add-user-group.dialog.scss']
})
export class AddUserGroupDialog implements OnInit {
   matChipConfiguration = { visible: true, selectable: true, removable: true, addOnBlur: false };
   separatorKeysCodes: number[] = [ENTER, COMMA];

   form: FormGroup;

   filteredPeople$: Observable<any[]>;

   selectedPeople: People[] = [];
   private _peoples: any[] = [];

   peopleCtrl = new FormControl();

   @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
   @ViewChild('peopleInput', { static: false }) peopleInput: ElementRef<HTMLInputElement>;

   constructor(
      private _groupService: GroupService,
      private _peopleService: PeopleService,
      private _peopleGroupService: PeopleGroupService,

      private _fb: FormBuilder,
      private _dialogRef: MatDialogRef<AddUserGroupDialog>,
   ) {
      this.form = this._fb.group({
         name: ['', Validators.compose([
            Validators.minLength(3),
            Validators.required
         ])]
      });
   }

   async ngOnInit() {
      await this._loadData();

      this.filteredPeople$ = this.peopleCtrl.valueChanges.pipe(
         startWith(null),
         map((name: string | null) =>
            name ? this._filterChip(name) : this._peoples.slice()
         )
      );
   }

   private async _loadData() {
      await this._peopleService.getAll()
         .toPromise()
         .then((res: any) => {
            this._peoples = res;
         }).catch(error => console.log(error));

      this._peoples = this._peoples.filter(el => el.createdById === Security.getUser().peopleId);
   }

   onSubmit(form) {
      this._groupService.create(form.value).subscribe(
         (res: any) => {
            this.selectedPeople.forEach(people => {
               this._peopleGroupService.create({ id: 0, peopleId: people.id, groupId: res.id, createdById: Security.getUser().peopleId }).subscribe();
               this._dialogRef.close('Success!');
            });
         },
         (error) => { console.log(error); });
   }

   addChip(event: MatChipInputEvent) {

   }

   removeChip(people) {
      const index = this.selectedPeople.indexOf(people);

      if (index >= 0) {
         this.selectedPeople.splice(index, 1);
      }
   }

   selectedChip(event: MatAutocompleteSelectedEvent) {
      const id = event.option.value;
      const name = event.option.viewValue;

      this.selectedPeople.push(new People(id, name, null))

      this.peopleInput.nativeElement.value = '';
      this.peopleCtrl.setValue(null);
   }

   private _filterChip(peopleName): People[] {
      if (typeof (peopleName) === 'number') return;

      const filterValue = peopleName.toLowerCase();

      return this._peoples.filter((people: People) =>
         people.name.toLowerCase().indexOf(filterValue) === 0
      );
   }
}
