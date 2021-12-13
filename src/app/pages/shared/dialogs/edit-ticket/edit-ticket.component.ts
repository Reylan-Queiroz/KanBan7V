import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatCheckboxChange } from '@angular/material';
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
   public matChipConfiguration = { visible: true, selectable: true, removable: true, addOnBlur: false }

   public description: string = this.ticket.description;

   public memberCtrl = new FormControl();
   public searchTagCtrl = new FormControl();
   public conversationCtrl = new FormControl();

   public separatorKeysCodes: number[] = [ENTER, COMMA];

   public allMembers: any = [];
   public allTags: any = [];

   public filteredMembers: Observable<People[]>;
   public filteredTags: Observable<Tag[]>;

   public get sortConversation() {
      if (this.ticket.conversation != null) {
         return this.ticket.conversation.sort(
            (a, b) => {
               return <any>new Date(b.dateTime) - <any>new Date(a.dateTime);
            });
      }
   }

   @ViewChild('memberInput', { static: false }) memberInput: ElementRef<HTMLInputElement>;
   @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

   constructor(
      public dialogRef: MatDialogRef<EditTicketComponent>,
      @Inject(MAT_DIALOG_DATA) public ticket: Ticket,
      private memberService: MemberService,
      private tagService: TagService
   ) { }

   async ngOnInit() {
      this.allMembers = await this.memberService.getAll().toPromise();
      this.allTags = await this.tagService.getAll().toPromise();

      this.filteredMembers = this.memberCtrl.valueChanges.pipe(
         startWith(null),
         map(
            (memberName: string | null) => memberName ? this.filterChip(memberName) : this.allMembers.slice()
         ));

      this.filteredTags = this.searchTagCtrl.valueChanges.pipe(
         startWith(null),
         map(
            (tagName: string | null) => tagName ? this.filterTag(tagName) : this.allTags.slice()
         ));
   }

   public addChip(event: MatChipInputEvent): void {
      const input = event.input;
      const value = event.value;

      if ((value || '').trim()) {
         const peopleId = this.ticket.assignedToPeople.length + 1;

         this.ticket.assignedToPeople.push(new People(peopleId, value));
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

      this.ticket.assignedToPeople.push(new People(memberId, memberName));
      this.memberInput.nativeElement.value = '';
      this.memberCtrl.setValue(null);
   }

   private filterChip(memberName: string): People[] {
      const filterValue = memberName.toLowerCase();

      return this.allMembers.filter(
         (member: People) => member.peopleName.toLowerCase().indexOf(filterValue) === 0
      );
   }

   private filterTag(tagName: string): Tag[] {
      const filterValue = tagName.toLowerCase();

      return this.allTags.filter(
         (tag: Tag) => tag.tagName.toLowerCase().indexOf(filterValue) !== -1
      );
   }

   public addConversation(event: KeyboardEvent): void {
      if (event.key === 'Enter') {
         const input: HTMLInputElement = (<HTMLInputElement>event.target);
         const conversationId = this.ticket.conversation.length + 1;
         const conversationText: string = input.value;

         if ((conversationText || '').trim()) {
            this.ticket.conversation.push(new Conversation(conversationId, conversationText, new Date(), new People(1, "Reylan")));

            this.conversationCtrl.setValue(null);
         }
      }
   }

   public addNewTag(event: KeyboardEvent) {
      if (event.key === 'Enter') {
         const input: HTMLInputElement = (<HTMLInputElement>event.target);
         const tagId = this.ticket.tagList.length + 1;
         const tagText: string = input.value;
         const tagChecked: boolean = false;

         if ((tagText || '').trim()) {
            this.ticket.tagList.push(new Tag(tagId, tagText, tagChecked));

            input.value = '';
            Utils.clickButton('btnCollapseAddTag');
         }
      }
   }

   public addTagToTicket(event: MatCheckboxChange) {
      const tagId = Number.parseInt(event.source.id);
      const tagChecked = event.checked;

      let tag: Tag = this.ticket.tagList.find(
         (tag: Tag) => tag.tagId === tagId
      );

      tag.tagChecked = tagChecked;
   }

   public focusInput(inputName: string) {
      Utils.autoFocus(inputName);
   }
}

