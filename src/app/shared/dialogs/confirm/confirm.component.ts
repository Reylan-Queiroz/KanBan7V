import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
   selector: 'app-confirm',
   templateUrl: './confirm.component.html',
   styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {
   constructor(public dialogRef: MatDialogRef<ConfirmComponent>, @Inject(MAT_DIALOG_DATA) public msg: any) { }

   ngOnInit() {
   }

}
