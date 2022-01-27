import { ColumnService } from 'src/app/core/services/column.service';
import { ToastrService } from 'ngx-toastr';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatCheckboxChange } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { map, startWith } from 'rxjs/operators';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { PeopleService } from 'src/app/core/services/people.service';
import { TagService } from 'src/app/core/services/tag.service';
import { Column } from 'src/app/shared/models/column';
import { ConversationService } from 'src/app/core/services/conversation.service';
import { Conversation } from 'src/app/shared/models/conversation';
import { People } from 'src/app/shared/models/people';
import { Tag } from 'src/app/shared/models/tag';
import { Ticket } from 'src/app/shared/models/ticket';
import { FileModel } from 'src/app/shared/models/fileModel';
import { User } from 'src/app/shared/models/user';
import { TicketService } from 'src/app/core/services/ticket.service';
import { AssignedToPeopleService } from 'src/app/core/services/assignedToPeople.service';
import { TicketTagsService } from 'src/app/core/services/ticketTags.service';
import { ColorService } from 'src/app/core/services/color.service';
import { FileService } from 'src/app/core/services/file.service';
import { ConversationFileService } from 'src/app/core/services/conversationFile.service';
import { TicketFileService } from 'src/app/core/services/ticketFile.service';
import { AddTagComponent } from '../../tag/add-tag/add-tag.component';

@Component({
   selector: 'app-edit-ticket',
   templateUrl: './edit-ticket.component.html',
   styleUrls: ['./edit-ticket.component.scss']
})
export class EditTicketComponent implements OnInit {
   private wasChanged = new BehaviorSubject<boolean>(false);

   changed = false;
   hasFile = false;

   searchText = '';

   matChipConfiguration = { visible: true, selectable: true, removable: true, addOnBlur: false }

   description: string = this.data.ticket.description;
   dueDate: Date = null;

   peopleCtrl = new FormControl();

   separatorKeysCodes: number[] = [ENTER, COMMA];

   private allPeoples: any[] = [];
   private allFiles: FileModel[] = [];

   columns: Column[] = [];
   allTags: any = [];
   allTicketFiles: any = [];

   filteredPeople$: Observable<any[]>;

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
      @Inject(MAT_DIALOG_DATA) public data: { ticket: any, column: Column, user: User, boardId: number },

      private toastrService: ToastrService,
      private peopleService: PeopleService,
      private tagService: TagService,
      private conversationService: ConversationService,
      private ticketService: TicketService,
      private assignedToPeopleService: AssignedToPeopleService,
      private ticketTagsService: TicketTagsService,
      private colorService: ColorService,
      private fileService: FileService,
      private conversationFileService: ConversationFileService,
      private ticketFileService: TicketFileService,
      private columnService: ColumnService
   ) { }

   async ngOnInit() {
      await this.loadData();

      if (!this.data.ticket.dueDate.toString().startsWith('0001')) { this.dueDate = this.data.ticket.dueDate }

      this.wasChanged.subscribe(async changed => changed === true ? await this.loadData() : '');

      this.filteredPeople$ = this.peopleCtrl.valueChanges.pipe(
         startWith(null),
         map((name: string | null) =>
            name ? this.filterChip(name) : this.allPeoples.slice()
         )
      );
   }

   private async loadData() {
      let conversations = [];
      let assignedToPeople = [];
      let colors = [];
      let ticketTags = [];
      let conversationFiles = [];

      this.data.ticket.assignedToPeople = [];
      this.data.ticket.conversations = [];
      this.data.ticket.files = [];

      await this.columnService.getAll()
         .toPromise()
         .then((response: any) => {
            this.columns = (response || []).filter(el => el.boardId === this.data.boardId);
         }).catch(error => console.log(error));

      await this.ticketTagsService.getAll()
         .toPromise()
         .then((response: any) => {
            ticketTags = response;
         }).catch(error => console.log(error));

      await this.tagService.getAll()
         .toPromise()
         .then((response: any) => {
            this.allTags = response;
         }).catch(error => console.log(error));

      await this.colorService.getAll()
         .toPromise()
         .then((response: any) => {
            colors = response;
         }).catch(error => console.log(error));

      await this.peopleService.getAll()
         .toPromise()
         .then((response: any) => {
            this.allPeoples = response;
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

      await this.fileService.getAll()
         .toPromise()
         .then((response: any) => {
            this.allFiles = response;
         }).catch(error => console.log(error));

      await this.ticketFileService.getAll()
         .toPromise()
         .then((response: any) => {
            this.allTicketFiles = response;
         }).catch(error => console.log(error));

      await this.conversationFileService.getAll()
         .toPromise()
         .then((response: any) => {
            conversationFiles = response;
         }).catch(error => console.log(error));

      this.allTicketFiles.forEach(element => {
         element.file = this.allFiles.find(el => el.id === element.fileId);

         if (element.ticketId === this.data.ticket.id) {
            this.data.ticket.files.push(element)
         }
      });

      conversationFiles.forEach(element => {
         element.file = this.allFiles.find(el => el.id === element.fileId);
      });

      conversations.forEach((conversation: Conversation) => {
         if (conversation.ticketId !== this.data.ticket.id) { return; }

         conversationFiles.forEach(element => {
            if (element.conversationId === conversation.id) {
               conversation.conversationFileId = element.id;
               conversation.file = element;
            }
         });

         conversation.postedBy = this.allPeoples.find(el => el.id === conversation.postedById);

         this.data.ticket.conversations.push(conversation);
      });

      assignedToPeople.forEach(element => {
         if (element.ticketId !== this.data.ticket.id) { return; }

         this.data.ticket.assignedToPeopleId = element.id;

         let people: People = this.allPeoples.find(el => el.id === element.peopleId);
         this.data.ticket.assignedToPeople.push(people);
      });

      ticketTags.forEach(elTicketTags => {
         elTicketTags.tag = this.allTags.find(el => el.id === elTicketTags.tagId);
      });

      this.allTags.forEach(elTags => {
         ticketTags.forEach(elTicketTags => {
            elTags.ticketTagsId = elTicketTags.id;
         });

         elTags.color = colors.find(el => el.id === elTags.colorId);
         this.data.ticket.tags.find(el => el.id === elTags.id) ? elTags.checked = true : null;
      });

      let column = this.columns.find(el => el.id == this.data.column.id)
      const index = this.columns.indexOf(column);
      this.columns.splice(index, 1);
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

   removeChip(assignedToPeople) {
      const index = this.data.ticket.assignedToPeople.indexOf(assignedToPeople.people);
      let ticket: any = this.data.ticket;

      this.assignedToPeopleService.create(ticket.assignedToPeopleId).subscribe(
         () => { this.data.ticket.assignedToPeople.splice(index, 1); },
         (error) => { console.log(error); }
      );
   }

   selectedChip(event: MatAutocompleteSelectedEvent) {
      const id = event.option.value;
      const name = event.option.viewValue;

      if (this.data.ticket.assignedToPeople.find(el => el.id === id)) return;

      this.data.ticket.assignedToPeople.push(new People(id, name));

      let obj = { id: 0, peopleId: id, ticketId: this.data.ticket.id };

      this.assignedToPeopleService.create(obj).subscribe(
         () => { },
         (error) => { console.log(error); }
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
      if (description.trim() === this.data.ticket.description.trim()) return;

      this.data.ticket.description = description.trim();

      this.ticketService.update(this.data.ticket.id, this.data.ticket).subscribe(
         () => { },
         (error) => { console.log(error); }
      );
   }

   moveTicket(columId) {
      this.data.ticket.columnId = columId;

      this.ticketService.update(this.data.ticket.id, this.data.ticket).subscribe(
         () => { this.changed = true; },
         (error) => { console.log(error); }
      );
   }

   addConversation(event: KeyboardEvent) {
      const input: HTMLInputElement = (<HTMLInputElement>event.target);
      const id: number = this.data.ticket.conversations.length + 1;
      const text: string = input.value;

      if ((text || '').trim()) {
         const people = this.allPeoples.find(el => el.id === this.data.user.peopleId);
         const conversation = new Conversation(id, text, '', new Date(), false, null, null, this.data.user.peopleId, people, this.data.ticket.id, null);

         input.value = '';

         this.conversationService.create(conversation).subscribe(
            () => { this.wasChanged.next(true); },
            (error) => { console.log(error); }
         );
      }
   }

   addFileToConversation(file, conversation: Conversation) {
      this.getBase64(file).subscribe(res => {
         const obj = { FileAsBase64: res, FileName: file.name };

         this.fileService.create(obj).subscribe(
            (result: any) => {
               const obj = { Id: 0, ConversationId: conversation.id, FileId: result.id };

               this.conversationFileService.create(obj).subscribe(
                  () => { this.wasChanged.next(true); },
                  (error) => { console.log(error); }
               );
            },
            (error) => { console.log(error); }
         );
      });
   }

   addOrRemoveTagToTicket(event: MatCheckboxChange, ticketTagsId: number) {
      const id: number = Number.parseInt(event.source.id);

      let tag: Tag = this.allTags.find((tag: Tag) => tag.id === id);

      if (!tag) return;

      if (event.checked === false) {
         this.ticketTagsService.delete(ticketTagsId).subscribe(
            () => { this.changed = true; },
            (error) => { console.log(error); }
         );
      } else {
         const obj = { id: 0, tagId: tag.id, ticketId: this.data.ticket.id };

         this.ticketTagsService.create(obj).subscribe(
            () => { this.changed = true; },
            (error) => { console.log(error); }
         );
      }
   }

   addDueDate(event) {
      this.data.ticket.dueDate = new Date();
      this.data.ticket.dueDate = event.value;

      this.ticketService.update(this.data.ticket.id, this.data.ticket).subscribe(
         () => { this.changed = true },
         (error) => { console.log(error); }
      );
   }

   addFileToTicket(file, ticket: Ticket) {
      this.getBase64(file).subscribe(res => {
         const obj = { FileAsBase64: res, FileName: file.name };

         this.fileService.create(obj).subscribe(
            (result: any) => {
               const obj = { TicketId: ticket.id, FileId: result.id };

               this.ticketFileService.create(obj).subscribe(
                  () => { this.wasChanged.next(true); },
                  (error) => { console.log(error); }
               );
            },
            (error) => { console.log(error); }
         );
      });
   }

   removeFileToTicket(file) {

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
      const oldText = conversation.text;

      this.switchToEditMode(null, index);

      if (text === conversation.text) return;

      conversation.text = text;
      conversation.oldText = oldText;
      conversation.modified = true;

      this.conversationService.update(conversation.id, conversation).subscribe(
         () => { },
         (error) => { console.log(error); }
      );
   }

   cancelTheEdit(index) {
      this.switchToEditMode(null, index);
   }

   openAddTagDialog() {
      const dialogRef = this.matDialog.open(AddTagComponent, {
         width: '350px',
         position: { top: '40px' },
         data: {},
         disableClose: false
      });

      dialogRef.afterClosed().subscribe(
         (result) => {
            if (!result) return;

            this.wasChanged.next(true);
         }, (error) => { console.log(error); }
      );
   }

   private getBase64(file) {
      const res = new ReplaySubject<string>(1);

      let reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => res.next(reader.result.toString());

      return res;
   }

   downloadFile(ticketFile) {
      const linkSource = `${ticketFile.file.base64signature},${ticketFile.file.bytes}`;
      const downloadLink = document.createElement("a");
      const fileName = ticketFile.file.fileName;

      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
      downloadLink.remove();
   }
}
