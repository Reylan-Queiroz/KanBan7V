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
   private wasChanged = new BehaviorSubject<boolean>(false);

   colors: Observable<Color[]>;
   form: FormGroup;
   selectedColor: string;

   constructor(
      private dialogRef: MatDialogRef<AddTagDialog>,
      private fb: FormBuilder,
      private matDialog: MatDialog,

      private colorService: ColorService,
      private tagService: TagService,
   ) {
      this.form = this.fb.group({
         name: ['', Validators.compose([
            Validators.required,
            Validators.minLength(3)
         ])],
         color: ''
      });
   }

   ngOnInit() {
      this.loadData();

      this.wasChanged.subscribe(changed => changed === true ? this.loadData() : '');
   }

   selectColor(event: MatSelectChange) {
      this.colorService.getById(event.value).subscribe(
         (response: any) => {
            this.selectedColor = response.code;
         }, (error) => { console.log(error); }
      );
   }

   private loadData() {
      this.colorService.getAll().subscribe(
         (response) => { this.colors = response; },
         (error) => { console.log(error); }
      );
   }

   onSubmit(form: FormGroup) {
      this.tagService.create(new Tag(0, form.value['name'], false, form.value['color'], undefined)).subscribe(
         () => {
            this.dialogRef.close(true);
         }, (error) => { console.log(error); }
      );
   }

   openColorPickerDialog(): void {
      const dialogRef = this.matDialog.open(ColorPickerDialog, {
         position: { top: "40px" }
      });

      dialogRef.afterClosed().subscribe(result => {
         if (!result) { return; }

         this.colorService.create(result).subscribe(
            () => { this.wasChanged.next(true); },
            (error) => { console.log(error); }
         );
      });
   }
}
