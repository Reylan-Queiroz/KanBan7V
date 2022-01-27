import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
   selector: 'app-color-picker-dialog',
   templateUrl: './color-picker.component.html',
   styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent {
   form: FormGroup;

   selectedColor = '';

   constructor(
      private dialogRef: MatDialogRef<ColorPickerComponent>,
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
