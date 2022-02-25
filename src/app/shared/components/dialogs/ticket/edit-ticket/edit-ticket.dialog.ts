import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatCheckboxChange } from '@angular/material';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { map, startWith } from 'rxjs/operators';
import { AssignedToService } from 'src/app/core/services/assignedTo.service';
import { ColorService } from 'src/app/core/services/color.service';
import { ColumnService } from 'src/app/core/services/column.service';
import { ConversationService } from 'src/app/core/services/conversation.service';
import { ConversationFileService } from 'src/app/core/services/conversationFile.service';
import { FileService } from 'src/app/core/services/file.service';
import { GroupService } from 'src/app/core/services/group.service';
import { PeopleService } from 'src/app/core/services/people.service';
import { PeopleGroupService } from 'src/app/core/services/peopleGroup.service';
import { TagService } from 'src/app/core/services/tag.service';
import { TicketService } from 'src/app/core/services/ticket.service';
import { TicketFileService } from 'src/app/core/services/ticketFile.service';
import { TicketTagsService } from 'src/app/core/services/ticketTags.service';
import { AssignedTo } from 'src/app/shared/models/assignedTo';
import { Column } from 'src/app/shared/models/column';
import { Conversation } from 'src/app/shared/models/conversation';
import { FileModel } from 'src/app/shared/models/fileModel';
import { People } from 'src/app/shared/models/people';
import { PeopleGroup } from 'src/app/shared/models/peopleGroup';
import { Tag } from 'src/app/shared/models/tag';
import { Ticket } from 'src/app/shared/models/ticket';
import { User } from 'src/app/shared/models/user';
import { AddTagDialog } from '../../tag/add-tag/add-tag.dialog';
import { Security } from './../../../../utils/security.util';

@Component({
   selector: 'app-edit-ticket',
   templateUrl: './edit-ticket.dialog.html',
   styleUrls: ['./edit-ticket.dialog.scss']
})
export class EditTicketDialog implements OnInit {
   private wasChanged = new BehaviorSubject<boolean>(false);
   private _currentUser: any = Security.getUser();

   changed = false;

   searchText = '';

   matChipConfiguration = { visible: true, selectable: true, removable: true, addOnBlur: false }

   description: string = this.data.ticket.description;

   peopleCtrl = new FormControl();

   separatorKeysCodes: number[] = [ENTER, COMMA];

   peoplesAndGroups: any[] = [];

   private allPeoples: any[] = [];
   private allFiles: FileModel[] = [];
   private peopleGroups: PeopleGroup[] = [];

   columns: Column[] = [];
   allTags: any = [];
   allTicketFiles: any = [];

   filteredPeoplesAndGroups$: Observable<any[]>;

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
      @Inject(MAT_DIALOG_DATA) public data: { ticket: any, column: Column, user: User, boardId: number },
      private dialogRef: MatDialogRef<EditTicketDialog>,
      private matDialog: MatDialog,
      private _datePipe: DatePipe,
      private _spinner: NgxSpinnerService,

      private toastrService: ToastrService,
      private peopleService: PeopleService,
      private tagService: TagService,
      private conversationService: ConversationService,
      private ticketService: TicketService,
      private assignedToService: AssignedToService,
      private ticketTagsService: TicketTagsService,
      private colorService: ColorService,
      private fileService: FileService,
      private conversationFileService: ConversationFileService,
      private ticketFileService: TicketFileService,
      private columnService: ColumnService,
      private _groupService: GroupService,
      private _peopleGroupService: PeopleGroupService,
   ) { }

   async ngOnInit() {
      await this.loadData();

      this.wasChanged.subscribe(async changed => changed ? await this.loadData() : '');

      this.filteredPeoplesAndGroups$ = this.peopleCtrl.valueChanges.pipe(
         startWith(null),
         map((name: string | null) =>
            name ? this.filterChip(name) : this.peoplesAndGroups.slice()
         )
      );
   }

   private async loadData() {
      this._spinner.show();

      let conversations = [];
      let assignedTo = [];
      let colors = [];
      let ticketTags = [];
      let conversationFiles = [];
      let groups: any[] = [];

      let peopleGroupRes;
      let peopleGroup: PeopleGroup;

      this.data.ticket.assignedTo = [];
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

      await this.assignedToService.getAll()
         .toPromise()
         .then((response: any) => {
            assignedTo = response;
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

      await this._groupService.getAll()
         .toPromise()
         .then((response: any) => {
            groups = (response || []);;
         }).catch(error => console.log(error));

      await this._peopleGroupService.getAll()
         .toPromise()
         .then((response: any) => {
            peopleGroupRes = (response || []);
         }).catch(error => console.log(error));

      this.allPeoples = this.allPeoples.filter(el => el.createdById === this._currentUser.people.createdById);

      peopleGroupRes = peopleGroupRes.filter(el => el.createdById === Security.getUser().people.createdById);
      peopleGroupRes.forEach(element => { element.people = this.allPeoples.find(el => el.id === element.peopleId) });

      groups.forEach(group => {
         peopleGroup = new PeopleGroup(group.id, group.name, null, null, []);

         peopleGroupRes.forEach(element => {
            if (element.groupId !== peopleGroup.id) return;

            peopleGroup.createdById = element.createdById;

            peopleGroup.peoples.push(element.people);
         });

         if (peopleGroup.createdById !== Security.getUser().people.createdById) {
            return;
         }

         this.peopleGroups.push(peopleGroup);

         let item: any = peopleGroup;
         item.type = 'group';

         this.peoplesAndGroups.push(item);
      });

      assignedTo.forEach(element => {
         if (element.ticketId !== this.data.ticket.id) { return; }
         let item;

         if (element.peopleId !== null) {
            item = this.allPeoples.find(el => el.id === element.peopleId);
         }

         if (element.groupId !== null) {
            item = groups.find(el => el.id === element.groupId);
         }

         item.assignedToId = element.id;
         this.data.ticket.assignedTo.push(item);
      });

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

      this.allPeoples.forEach(element => {
         element.type = 'people';
         this.peoplesAndGroups.push(element);
      });

      let column = this.columns.find(el => el.id == this.data.column.id);
      const index = this.columns.indexOf(column);
      this.columns.splice(index, 1);

      this._spinner.hide();
   }

   addChip(event: MatChipInputEvent) {
      // const input = event.input;
      // const id = this.data.ticket.assignedToPeople.length + 1;
      // const name = event.value;

      // if ((name || '').trim()) {
      //    this.data.ticket.assignedToPeople.push(new People(id, name));
      // }

      // input.value = '';
   }

   removeChip(assignedTo) {
      this.assignedToService.delete(assignedTo.assignedToId).subscribe(
         () => {
            this.wasChanged.next(true);
         }, (error) => { console.log(error); }
      );
   }

   selectedChip(item) {
      const type = item.type;
      let peopleId = null;
      let groupId = null;

      type === 'people' ? peopleId = item.id : groupId = item.id;

      let assignedTo: AssignedTo = new AssignedTo(0, peopleId, groupId, this.data.ticket.id)

      this.assignedToService.create(assignedTo).subscribe(
         () => {
            this.wasChanged.next(true);
         },
         (error) => { console.log(error); }
      );

      this.peopleInput.nativeElement.value = '';
      this.peopleCtrl.setValue(null);
   }

   private filterChip(name: string): People[] {
      if (typeof (name) === 'number') return;

      const filterValue = name.toLowerCase();

      return this.peoplesAndGroups.filter((element) =>
         element.name.toLowerCase().indexOf(filterValue) === 0
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

   ticketTransfer(columId) {
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
         const conversation = { id: id, text: text, oldText: '', date: this._datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'), modified: false, postedById: this.data.user.peopleId, postedBy: undefined, ticketId: this.data.ticket.id, ticket: undefined };

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

   addFileToTicket(file: File, ticket: Ticket) {
      this.getBase64(file).subscribe(res => {
         const obj = { FileAsBase64: res, FileName: file.name };

         this.fileService.create(obj).subscribe(
            (result: any) => {
               const obj = { TicketId: ticket.id, FileId: result.id };

               this.ticketFileService.create(obj).subscribe(
                  () => { this.wasChanged.next(true); },
                  (error) => { console.log(error); }
               );
            }, (error) => { console.log(error); }
         );
      });
   }

   removeFileToTicket(file) {
      this.fileService.delete(file.id).subscribe(
         () => { this.wasChanged.next(true); },
         (error) => { console.log(error); }
      );
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
      const dialogRef = this.matDialog.open(AddTagDialog, {
         width: '350px',
         position: { top: '40px' },
         data: {},
         disableClose: false
      });

      dialogRef.afterClosed().subscribe(
         (result) => {
            debugger;
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
      const downloadLink = document.createElement('a');
      const fileName = ticketFile.file.fileName;

      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
      downloadLink.remove();
   }
}
