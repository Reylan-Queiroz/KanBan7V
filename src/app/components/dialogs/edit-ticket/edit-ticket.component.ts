import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatCheckboxChange } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { map, startWith } from 'rxjs/operators';
import { TagService } from 'src/app/services/tag.service';
import { Utils } from 'src/app/helpers/utils';
import { People } from 'src/app/models/people';
import { Tag } from 'src/app/models/tag';
import { Ticket } from 'src/app/models/ticket';
import { Conversation } from 'src/app/models/conversation';
import { PeopleService } from 'src/app/services/people.service';
import { ConversationService } from 'src/app/services/conversation.service';
import { Column } from 'src/app/models/column';

@Component({
   selector: 'app-edit-ticket',
   templateUrl: './edit-ticket.component.html',
   styleUrls: ['./edit-ticket.component.css']
})
export class EditTicketComponent implements OnInit {
   matChipConfiguration = { visible: true, selectable: true, removable: true, addOnBlur: false }

   description: string = this.data.ticket.description;

   peopleCtrl = new FormControl();
   searchTagCtrl = new FormControl();
   conversationCtrl = new FormControl();

   separatorKeysCodes: number[] = [ENTER, COMMA];

   private allPeoples: any = [];
   private allTags: any = [];

   filteredPeople: Observable<People[]>;
   filteredTags: Observable<Tag[]>;

   get sortConversation() {
      if (this.data.ticket.conversation != null) {
         return this.data.ticket.conversation.sort(
            (a, b) => {
               return <any>new Date(b.date) - <any>new Date(a.date);
            });
      }
   }

   @ViewChild('peopleInput', { static: false }) peopleInput: ElementRef<HTMLInputElement>;
   @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

   constructor(
      private dialogRef: MatDialogRef<EditTicketComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { ticket: Ticket, column: Column },

      private toastrService: ToastrService,
      private peopleService: PeopleService,
      private tagService: TagService,
      private conversationService: ConversationService
   ) { }

   async ngOnInit() {
      this.allPeoples = await this.peopleService.getAll().toPromise();
      this.allTags = [];//await this.tagService.getAll().toPromise();

      this.filteredPeople = this.peopleCtrl.valueChanges.pipe(
         startWith(null),
         map(
            (peopleName: string | null) =>
               peopleName ? this.filterChip(peopleName) : this.allPeoples.slice())
      );

      this.filteredTags = this.searchTagCtrl.valueChanges.pipe(
         startWith(null),
         map(
            (tagName: string | null) =>
               tagName ? this.filterTag(tagName) : this.allTags.slice())
      );
   }

   addChip(event: MatChipInputEvent) {
      const input = event.input;
      const value = event.value;

      if ((value || '').trim()) {
         const peopleId = this.data.ticket.assignedToPeople.length + 1;

         this.data.ticket.assignedToPeople.push(new People(peopleId, value));
      }

      if (input) {
         input.value = '';
      }
   }

   removeChip(people: People) {
      const index = this.data.ticket.assignedToPeople.indexOf(people);

      if (index >= 0) {
         this.data.ticket.assignedToPeople.splice(index, 1);
      }
   }

   selectedChip(event: MatAutocompleteSelectedEvent) {
      const peopleId = this.data.ticket.assignedToPeople.length + 1;
      const peopleName = event.option.viewValue;

      this.data.ticket.assignedToPeople.push(new People(peopleId, peopleName));

      this.peopleInput.nativeElement.value = '';
      this.peopleCtrl.setValue(null);
   }

   private filterChip(peopleName: string): People[] {
      const filterValue = peopleName.toLowerCase();

      return this.allPeoples.filter(
         (people: People) =>
            people.name.toLowerCase().indexOf(filterValue) === 0
      );
   }

   private filterTag(tagName: string): Tag[] {
      const filterValue = tagName.toLowerCase();

      return this.allTags.filter(
         (tag: Tag) =>
            tag.name.toLowerCase().indexOf(filterValue) !== -1
      );
   }

   addConversation(event: KeyboardEvent) {
      if (event.key === 'Enter') {
         const input: HTMLInputElement = (<HTMLInputElement>event.target);
         const conversationText: string = input.value;

         if ((conversationText || '').trim()) {
            const conversation = new Conversation(0, conversationText, new Date(), null, 1, this.data.ticket.id);

            this.conversationService.create(conversation).subscribe(
               () => {
                  this.data.ticket.conversation.push(conversation);
               },
               (error: HttpErrorResponse) => {
                  this.showToastrError(error.message, '')
               }
            );

            input.value = '';
         }
      }
   }

   addNewTag(event: KeyboardEvent) {
      if (event.key === 'Enter') {
         const input: HTMLInputElement = (<HTMLInputElement>event.target);
         const tagText: string = input.value;
         const tagChecked: boolean = false;

         if ((tagText || '').trim()) {
            this.data.ticket.tagList.push(new Tag(0, tagText, tagChecked));

            input.value = '';
            // Utils.clickButton('btnCollapseAddTag');
         }
      }
   }

   addTagToTicket(event: MatCheckboxChange) {
      const tagId: number = Number.parseInt(event.source.id);
      const tagChecked: boolean = event.checked;

      let tag: Tag = this.data.ticket.tagList.find(
         (tag: Tag) =>
            tag.id === tagId
      );

      tag.checked = tagChecked;
   }

   focusInput(inputName: string) {
      Utils.autoFocus(inputName);
   }

   private showToastrSuccess(msg: string, title: string) {
      this.toastrService.success(msg, title, { closeButton: true, progressBar: true, timeOut: 2000 });
   }

   private showToastrError(msg: string, title: string) {
      this.toastrService.error(msg, title, { closeButton: true, progressBar: true, timeOut: 2000 });
   }

   switchToEdit(event: PointerEvent, index: number) {
      let element: HTMLElement = (<HTMLElement>document.getElementById('inp' + index));
      element.attributes.item(2).value = 'true';

      element.style.border = '1px solid #ced4da';
      element.style.padding = '5px';
      element.style.marginTop = '10px';
      element.style.borderRadius = '0.25rem';
      element.style.maxHeight = '60px';

      element.focus();
   }

   editConversationText(event: KeyboardEvent) {

   }
}
