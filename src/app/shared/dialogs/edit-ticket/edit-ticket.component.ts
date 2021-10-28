import { Component, ElementRef, Inject, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatInput } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { map, startWith } from 'rxjs/operators';
import { Ticket } from 'src/app/domain/models/ticket';
import { People } from 'src/app/domain/models/people';
import { MemberService } from 'src/app/domain/services/member.service';
import { Conversation } from 'src/app/domain/models/conversation';

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

   public memberCtrl = new FormControl();
   public conversationCtrl = new FormControl();

   public separatorKeysCodes: number[] = [ENTER, COMMA];
   public filteredMembers: Observable<People[]>;
   public allMembers: any = [];

   @ViewChild('memberInput', { static: false }) memberInput: ElementRef<HTMLInputElement>;
   @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

   constructor(public dialogRef: MatDialogRef<EditTicketComponent>, @Inject(MAT_DIALOG_DATA) public ticket: Ticket, private _memberService: MemberService) { }

   async ngOnInit() {
      this.allMembers = await this._memberService.getAll().toPromise();

      this.filteredMembers = this.memberCtrl.valueChanges.pipe(
         startWith(null),
         map((memberName: string | null) => memberName ? this._filterChip(memberName) : this.allMembers.slice()));
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

   private _filterChip(memberName: string): People[] {
      const filterValue = memberName.toLowerCase();

      return this.allMembers.filter(member => member.peopleName.toLowerCase().indexOf(filterValue) === 0);
   }

   public addConversation(event: any): void {
      if (event.charCode === 13) {
         const input = event; //: KeyboardEvent
         const conversationId = this.ticket.conversation.length + 1;
         const conversationText = input.target.value;

         this.ticket.conversation.push(new Conversation().setItem(conversationId, conversationText, new Date(), new People()));

         this.conversationCtrl.setValue(null);
      }
   }
}

