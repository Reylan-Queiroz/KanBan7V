import { AddTagComponent } from './../../add-tag/add-tag.component';
import { User } from 'src/app/models/user';
import { TicketTagsService } from '../../../../services/ticketTags.service';
import { AssignedToPeopleService } from '../../../../services/assignedToPeople.service';
import { TicketService } from 'src/app/services/ticket.service';
import { GlobalConstants } from 'src/app/helpers/global-constants';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatCheckboxChange } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { map, startWith } from 'rxjs/operators';
import { TagService } from 'src/app/services/tag.service';
import { People } from 'src/app/models/people';
import { Tag } from 'src/app/models/tag';
import { Ticket } from 'src/app/models/ticket';
import { Conversation } from 'src/app/models/conversation';
import { PeopleService } from 'src/app/services/people.service';
import { ConversationService } from 'src/app/services/conversation.service';
import { Column } from 'src/app/models/column';
import { BehaviorSubject } from 'rxjs';
import { ColorPickerComponent } from '../../color-picker/color-picker.component';

@Component({
   selector: 'app-edit-ticket',
   templateUrl: './edit-ticket.component.html',
   styleUrls: ['./edit-ticket.component.scss']
})
export class EditTicketComponent implements OnInit {
   private wasChanged = new BehaviorSubject<boolean>(false);
   public changed = false;

   matChipConfiguration = { visible: true, selectable: true, removable: true, addOnBlur: false }

   description: string = this.data.ticket.description;

   peopleCtrl = new FormControl();
   searchTagCtrl = new FormControl();

   separatorKeysCodes: number[] = [ENTER, COMMA];

   private allPeoples: any[] = [];
   private allTags: any = [];

   filteredPeople$: Observable<any[]>;
   filteredTags$: Observable<any[]>;

   get sortConversation() {
      if (this.data.ticket.conversations != null) {
         return this.data.ticket.conversations.sort((a, b) => {
            return <any>new Date(b.date) - <any>new Date(a.date);
         });
      }
   }

   @ViewChild('peopleInput', { static: false }) peopleInput: ElementRef<HTMLInputElement>;
   @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

   constructor(
      private dialogRef: MatDialogRef<EditTicketComponent>,
      private matDialog: MatDialog,
      @Inject(MAT_DIALOG_DATA) public data: { ticket: Ticket, column: Column, user: User },

      private toastrService: ToastrService,
      private peopleService: PeopleService,
      private tagService: TagService,
      private conversationService: ConversationService,
      private ticketService: TicketService,
      private assignedToPeopleService: AssignedToPeopleService,
      private ticketTagsService: TicketTagsService
   ) { }

   async ngOnInit() {
      await this.loadData();

      this.wasChanged.subscribe(async changed => changed === true ? await this.loadData() : '');

      this.filteredPeople$ = this.peopleCtrl.valueChanges.pipe(
         startWith(null),
         map((name: string | null) =>
            name ? this.filterChip(name) : this.allPeoples.slice()
         ));

      this.filteredTags$ = this.searchTagCtrl.valueChanges.pipe(
         startWith(null),
         map((name: string | null) =>
            name ? this.filterTag(name) : this.allTags.slice()
         ));
   }

   private async loadData() {
      let ticketTags = [];
      let conversations = [];
      let assignedToPeople = []

      this.data.ticket.assignedToPeople = [];
      this.data.ticket.conversations = [];

      await this.peopleService.getAll()
         .toPromise()
         .then((response: any) => {
            this.allPeoples = response;
         }).catch(error => console.log(error));

      await this.tagService.getAll()
         .toPromise()
         .then((response: any) => {
            this.allTags = response;
         }).catch(error => console.log(error));

      await this.assignedToPeopleService.getAll()
         .toPromise()
         .then((response: any) => {
            assignedToPeople = response;
         }).catch(error => console.log(error));

      await this.conversationService.getAll()
         .toPromise()
         .then((response: any) => {
            conversations = response;
         }).catch(error => console.log(error));

      await this.ticketTagsService.getAll()
         .toPromise()
         .then((response: any) => {
            ticketTags = response;
         }).catch(error => console.log(error));

      ticketTags.forEach(element => {
         if (element.ticketId !== this.data.ticket.id) { return; }

         let tag = this.allTags.find(el => el.id === element.tagId);
         tag.checked = true;
         tag.ticketTagsId = element.id;
      });

      conversations.forEach((conversation: Conversation) => {
         if (conversation.ticketId !== this.data.ticket.id) { return; }

         conversation.postedBy = this.allPeoples.find(el => el.id === conversation.postedById);
         this.data.ticket.conversations.push(conversation);
      });

      assignedToPeople.forEach(element => {
         if (element.ticketId !== this.data.ticket.id) { return; }

         let people: People = this.allPeoples.find(el => el.id === element.peopleId);
         this.data.ticket.assignedToPeople.push(people);
      });
   }

   addChip(event: MatChipInputEvent) {
      const input = event.input;
      const id = this.data.ticket.assignedToPeople.length + 1;
      const name = event.value;

      if ((name || '').trim()) {
         this.data.ticket.assignedToPeople.push(new People(id, name));
      }

      input.value = '';
   }

   removeChip(people: People) {
      const index = this.data.ticket.assignedToPeople.indexOf(people);

      let ticket: any = this.data.ticket;

      this.assignedToPeopleService.delete(ticket.assignedToPeopleId).subscribe(
         () => {
            this.data.ticket.assignedToPeople.splice(index, 1);
         },
         (error: HttpErrorResponse) => { console.log(error); }
      );
   }

   selectedChip(event: MatAutocompleteSelectedEvent) {
      const id = event.option.value;
      const name = event.option.viewValue;

      this.data.ticket.assignedToPeople.push(new People(id, name));

      const obj = { id: 0, peopleId: id, ticketId: this.data.ticket.id };

      this.assignedToPeopleService.create(obj).subscribe(
         () => { },
         (error: HttpErrorResponse) => { console.log(error); }
      );

      this.peopleInput.nativeElement.value = '';
      this.peopleCtrl.setValue(null);
   }

   private filterChip(peopleName: string): People[] {
      const filterValue = peopleName.toLowerCase();

      return this.allPeoples.filter((people: People) =>
         people.name.toLowerCase().indexOf(filterValue) === 0
      );
   }

   addOrEditDescription(event: FocusEvent, description: string) {
      if (description === this.data.ticket.description) { return; }

      this.data.ticket.description = description;

      this.ticketService.update(this.data.ticket.id, this.data.ticket).subscribe(
         () => { },
         (error: HttpErrorResponse) => { console.log(error); }
      );
   }

   addConversation(event: KeyboardEvent) {
      const input: HTMLInputElement = (<HTMLInputElement>event.target);
      const id: number = this.data.ticket.conversations.length + 1;
      const text: string = input.value;

      if ((text || '').trim()) {
         const people = this.allPeoples.find(el => el.id === this.data.user.peopleId);
         const conversation = new Conversation(id, text, new Date(), people, this.data.user.peopleId, this.data.ticket.id);

         this.conversationService.create(conversation).subscribe(
            () => {
               this.data.ticket.conversations.push(conversation);
            },
            (error: HttpErrorResponse) => {
               this.toastrService.error(error.message, '', GlobalConstants.toastrConfig);
            }
         );

         input.value = '';
      }
   }

   switchToEditMode(event: PointerEvent, index: number) {
      const input: HTMLInputElement = (<HTMLInputElement>document.getElementById('inp' + index));
      const contentEditableValue = input.attributes.item(2).value === 'false' ? 'true' : 'false';
      input.attributes.item(2).value = contentEditableValue;

      const btnEdit: HTMLButtonElement = (<HTMLButtonElement>document.getElementById('btnEdit' + index));
      const btnFile: HTMLButtonElement = (<HTMLButtonElement>document.getElementById('btnFile' + index));
      const btnDownload: HTMLButtonElement = (<HTMLButtonElement>document.getElementById('btnDownload' + index));
      const btnConfirm: HTMLButtonElement = (<HTMLButtonElement>document.getElementById('btnConfirm' + index));
      const btnCancel: HTMLButtonElement = (<HTMLButtonElement>document.getElementById('btnCancel' + index));

      if (contentEditableValue === 'true') {
         input.style.border = '1px solid #ced4da';
         input.style.borderRadius = '0.25rem';
         input.style.margin = '5px 0 5px 0';
         input.style.padding = '8px';

         btnEdit.classList.add('d-none');
         btnFile.classList.add('d-none');
         btnDownload.classList.add('d-none');

         btnConfirm.classList.remove('d-none');
         btnCancel.classList.remove('d-none');

         input.focus();
      } else {
         input.style.border = 'none';
         input.style.borderRadius = 'none';
         input.style.margin = '0';
         input.style.padding = '0';

         btnEdit.classList.remove('d-none');
         btnFile.classList.remove('d-none');
         btnDownload.classList.remove('d-none');

         btnConfirm.classList.add('d-none');
         btnCancel.classList.add('d-none');
      }
   }

   confirmTheEdit(conversation: Conversation, index: number) {
      const input: HTMLInputElement = (<HTMLInputElement>document.getElementById('inp' + index));
      const text = input.innerText.trim();

      this.switchToEditMode(null, index);

      if (text === conversation.text) { return; }

      conversation.text = text;

      this.conversationService.update(conversation.id, conversation).subscribe(
         () => {
            this.toastrService.success('Sucesso!', '', GlobalConstants.toastrConfig);
         },
         (error: HttpErrorResponse) => {
            this.toastrService.error('Falha!', '', GlobalConstants.toastrConfig);
         }
      );
   }

   cancelTheEdit(index) {
      this.switchToEditMode(null, index);
   }

   private filterTag(tagName: string): Tag[] {
      const filterValue = tagName.toLowerCase();

      return this.allTags.filter((tag: Tag) =>
         tag.name.toLowerCase().indexOf(filterValue) !== -1
      );
   }

   addTagToTicket(event: MatCheckboxChange, ticketTagsId: number) {
      const id: number = Number.parseInt(event.source.id);

      let tag: Tag = this.allTags.find((tag: Tag) =>
         tag.id === id
      );

      if (!tag) { return; }

      if (event.checked === false) {
         this.ticketTagsService.delete(ticketTagsId).subscribe(
            () => {
               this.changed = true;
            },
            (error: HttpErrorResponse) => { console.log(error); }
         );

         return;
      }

      const obj = { id: 0, tagId: tag.id, ticketId: this.data.ticket.id };

      this.ticketTagsService.create(obj).subscribe(
         () => {
            this.changed = true;
         },
         (error: HttpErrorResponse) => { console.log(error); }
      );
   }

   openColorPickerDialog(tag): void {
      const dialogRef = this.matDialog.open(ColorPickerComponent, {
         // width: '250px',
         data: {},
         disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
         console.log(result);
         if (result) {
            tag.color = result;
         }
      });
   }

   openAddTagDialog() {
      const dialogRef = this.matDialog.open(AddTagComponent, {
         width: '350px',
         position: { top: '40px' },
         data: {},
         disableClose: false
      });
   }
}
