import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
   selector: 'app-add-tag',
   templateUrl: './add-tag.component.html',
   styleUrls: ['./add-tag.component.scss']
})
export class AddTagComponent implements OnInit {
   form: FormGroup;

   constructor() { }

   ngOnInit() {
   }

   onSubmit(form: FormGroup) {

   }
}
