import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
   selector: 'app-color-picker',
   templateUrl: './color-picker.dialog.html',
   styleUrls: ['./color-picker.dialog.scss']
})
export class ColorPickerDialog {
   form: FormGroup;

   selectedColor = '';

   constructor(
      private _dialogRef: MatDialogRef<ColorPickerDialog>,
      private _fb: FormBuilder
   ) {
      this.form = this._fb.group({
         name: ''
      });
   }

   onChangeComplete(c) {
      this.selectedColor = c.color.hex;
   }

   onSubmit(form: FormGroup) {
      const obj = { code: this.selectedColor, name: form.value['name'] };
      this._dialogRef.close(obj);
   }
}
