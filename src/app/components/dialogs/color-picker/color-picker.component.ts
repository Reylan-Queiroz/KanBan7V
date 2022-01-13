import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
   selector: 'app-color-picker-dialog',
   templateUrl: './color-picker.component.html',
   styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {

   selectedColor = '';

   constructor(
      public dialogRef: MatDialogRef<ColorPickerComponent>,
   ) { }

   ngOnInit(): void {
   }

   onChangeComplete(c) {
      this.selectedColor = c.color.hex;
      console.log(c);
   }

}
