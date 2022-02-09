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
      private dialogRef: MatDialogRef<ColorPickerDialog>,
      private fb: FormBuilder
   ) {
      this.form = this.fb.group({
         name: ''
      });
   }

   onChangeComplete(c) {
      this.selectedColor = c.color.hex;
   }

   onSubmit(form: FormGroup) {
      const obj = { code: this.selectedColor, name: form.value['name'] };
      this.dialogRef.close(obj);
   }
}
