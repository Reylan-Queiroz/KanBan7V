import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { ColorService } from 'src/app/core/services/color.service';
import { TagService } from 'src/app/core/services/tag.service';
import { Color } from 'src/app/shared/models/color';
import { Tag } from 'src/app/shared/models/tag';
import { ColorPickerDialog } from '../../color-picker/color-picker.dialog';

@Component({
   selector: 'app-add-tag',
   templateUrl: './add-tag.dialog.html',
   styleUrls: ['./add-tag.dialog.scss']
})
export class AddTagDialog implements OnInit {
   private _wasChanged = new BehaviorSubject<boolean>(false);

   colors$: Observable<Color[]>;
   form: FormGroup;
   selectedColor: string;

   constructor(
      private _dialogRef: MatDialogRef<AddTagDialog>,
      private _fb: FormBuilder,
      private _matDialog: MatDialog,

      private _colorService: ColorService,
      private _tagService: TagService,
   ) {
      this.form = this._fb.group({
         name: ['', Validators.compose([
            Validators.required,
            Validators.minLength(3)
         ])],
         color: ''
      });
   }

   ngOnInit() {
      this._loadData();

      this._wasChanged.subscribe(changed => changed ? this._loadData() : '');
   }

   private _loadData() {
      this._colorService.findAll().subscribe(
         (response: any) => { this.colors$ = response; },
         (error) => { console.log(error); }
      );
   }

   selectColor(event: MatSelectChange) {
      this._colorService.findOne(event.value).subscribe(
         (response: any) => {
            this.selectedColor = response.code;
         }, (error) => { console.log(error); }
      );
   }

   onSubmit(form: FormGroup) {
      this._tagService.save(new Tag(0, form.value['name'], false, form.value['color'], undefined)).subscribe(
         () => {
            this._dialogRef.close(true);
         }, (error) => { console.log(error); }
      );
   }

   openColorPickerDialog(): void {
      const dialogRef = this._matDialog.open(ColorPickerDialog, {
         position: { top: "40px" }
      });

      dialogRef.afterClosed().subscribe(result => {
         if (!result) { return; }

         this._colorService.save(result).subscribe(
            () => { this._wasChanged.next(true); },
            (error) => { console.log(error); }
         );
      });
   }
}
