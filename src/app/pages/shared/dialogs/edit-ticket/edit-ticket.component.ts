import { Component, ElementRef, Inject, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatCheckboxChange, MatInput, MatSlideToggle, MatSlideToggleChange } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { map, startWith } from 'rxjs/operators';
import { Ticket } from 'src/app/domain/models/ticket';
import { People } from 'src/app/domain/models/people';
import { MemberService } from 'src/app/domain/services/member.service';
import { Conversation } from 'src/app/domain/models/conversation';
import { Tag } from 'src/app/domain/models/tag';
import { TagService } from 'src/app/domain/services/tag.service';
import { Utils } from 'src/app/helpers/utils';

@Component({
   selector: 'app-edit-ticket',
   templateUrl: './edit-ticket.component.html',
   styleUrls: ['./edit-ticket.component.css']
})
export class EditTicketComponent implements OnInit {
   public visible = true;
   public selectable = true;
   public removable = true;
   public addOnBlur = false;
   public description: string = this.ticket.description;

   public memberCtrl = new FormControl();
   public conversationCtrl = new FormControl();

   public separatorKeysCodes: number[] = [ENTER, COMMA];
   public allMembers: any = [];
   public allTags: any = [];

   public filteredMembers: Observable<People[]>;
   public filteredTags: any = [];

   get sortConversation() {
      if (this.ticket.conversation != null) {
         return this.ticket.conversation.sort((a, b) => {
            return <any>new Date(b.dateTime) - <any>new Date(a.dateTime);
         });
      }
   }

   private _tagFilter: string = "";
   public get tagFilter() {
      return this._tagFilter;
   }
   public set tagFilter(value: string) {
      this._tagFilter = value;
      this.filteredTags = this.tagFilter
         ? this.filterTags(this.tagFilter)
         : this.allTags;
   }

   @ViewChild('memberInput', { static: false }) memberInput: ElementRef<HTMLInputElement>;
   @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

   constructor(public dialogRef: MatDialogRef<EditTicketComponent>,
      @Inject(MAT_DIALOG_DATA) public ticket: Ticket,
      private _memberService: MemberService,
      private _tagService: TagService) { }

   async ngOnInit() {
      this.allMembers = await this._memberService.getAll().toPromise();
      this.allTags = await this._tagService.getAll().toPromise();

      this.filteredMembers = this.memberCtrl.valueChanges.pipe(
         startWith(null),
         map((memberName: string | null) => memberName ? this.filterChip(memberName) : this.allMembers.slice()));
   }

   public addChip(event: MatChipInputEvent): void {
      const input = event.input;
      const value = event.value;

      if ((value || '').trim()) {
         const peopleId = this.ticket.assignedToPeople.length + 1;

         this.ticket.assignedToPeople.push(new People().setItem(peopleId, value));
      }

      if (input) {
         input.value = '';
      }
   }

   public removeChip(people: People): void {
      const index = this.ticket.assignedToPeople.indexOf(people);

      if (index >= 0) {
         this.ticket.assignedToPeople.splice(index, 1);
      }
   }

   public selectedChip(event: MatAutocompleteSelectedEvent): void {
      const memberId = this.ticket.assignedToPeople.length + 1;
      const memberName = event.option.viewValue;

      this.ticket.assignedToPeople.push(new People().setItem(memberId, memberName));
      this.memberInput.nativeElement.value = '';
      this.memberCtrl.setValue(null);
   }

   private filterChip(memberName: string): People[] {
      const filterValue = memberName.toLowerCase();

      return this.allMembers.filter(member => member.peopleName.toLowerCase().indexOf(filterValue) === 0);
   }

   public addConversation(event: KeyboardEvent): void {
      if (event.key === 'Enter') {
         const input: HTMLInputElement = (<HTMLInputElement>event.target);
         const conversationId = this.ticket.conversation.length + 1;
         const conversationText: string = input.value;

         if ((conversationText || '').trim()) {
            this.ticket.conversation.push(new Conversation().setItem(conversationId, conversationText, new Date(), new People()));

            this.conversationCtrl.setValue(null);
         }
      }
   }

   public addNewTag(event: KeyboardEvent) {
      if (event.key === 'Enter') {
         const input: HTMLInputElement = (<HTMLInputElement>event.target);
         const tagId = this.ticket.tag.length + 1;
         const tagText: string = input.value;
         const tagChecked: boolean = false;

         if ((tagText || '').trim()) {
            this.ticket.tag.push(new Tag().setItem(tagId, tagText, tagChecked));

            input.value = '';
            Utils.clickButton('btnCollapseAddTag');
         }
      }
   }

   public addTagToTicket(event: MatCheckboxChange) {
      const tagId = Number.parseInt(event.source.id);
      const tagChecked = event.checked;

      let tag: Tag = this.ticket.tag.find(l => l.tagId === tagId);
      tag.tagChecked = tagChecked;
   }

   public focusInput(inputName) {
      Utils.autoFocus(inputName);
   }

   private filterTags(filterBy: string): any {
      filterBy = filterBy.toLocaleLowerCase();
      return this.allTags.filter(
         (tag: Tag) =>
            tag.tagName.toLocaleLowerCase().indexOf(filterBy) !== -1
      );
   }
}

