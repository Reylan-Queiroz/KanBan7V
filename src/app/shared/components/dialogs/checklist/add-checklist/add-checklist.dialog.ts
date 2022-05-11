import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ChecklistService } from 'src/app/core/services/checklist.service';
import { ChecklistEtapasService } from 'src/app/core/services/checklistEtapas.service';
import { ChecklistForTicketService } from 'src/app/core/services/checklistForTicket.service';
import { Checklist } from 'src/app/shared/models/checklist';
import { CheckListEtapa } from 'src/app/shared/models/checkListEtapa';

@Component({
   selector: 'app-add-checklist',
   templateUrl: './add-checklist.dialog.html',
   styleUrls: ['./add-checklist.dialog.scss']
})
export class AddChecklistDialog implements OnInit {
   form: FormGroup;
   checklists: Checklist[] = [];

   constructor(
      @Inject(MAT_DIALOG_DATA) private _data: { ticket: any },
      private _dialogRef: MatDialogRef<AddChecklistDialog>,
      private _fb: FormBuilder,

      private _checklistService: ChecklistService,
      private _checklistEtapasService: ChecklistEtapasService,
      private _checklistForTicketService: ChecklistForTicketService,
   ) {
      this.form = this._fb.group({
         dataInicio: ['', Validators.required],
         templateId: ['', Validators.required],
      });
   }

   async ngOnInit() {
      await this._loadData();
   }

   private async _loadData() {
      await this._checklistService.getAll()
         .toPromise()
         .then((response: any) => {
            this.checklists = response;
         }).catch(error => console.log(error));

      let checklistEtapas: CheckListEtapa[] = [];

      await this._checklistEtapasService.getAll()
         .toPromise()
         .then((response: any) => {
            checklistEtapas = response;
         }).catch(error => console.log(error));

      this.checklists.forEach(checklist => {
         let newChecklistEtapa: CheckListEtapa;

         checklist.checkListEtapas.forEach(oldChecklistEtapa => {
            newChecklistEtapa = checklistEtapas.find(l => l.id == oldChecklistEtapa.id);

            oldChecklistEtapa.children = newChecklistEtapa.children;
         });
      });
   }

   onSubmit(form: FormGroup) {
      const checklistId = form.value['templateId'];
      const dataInicio = form.value['dataInicio'];
      const ticketId = this._data.ticket.id;

      const checklistForTicket = { DataInicio: dataInicio, TicketId: ticketId, Ticket: null, ChecklistId: checklistId, Checklist: null };

      this._checklistForTicketService.save(checklistForTicket)
         .subscribe(() => {

         }, (error) => { console.log(error) })
   }
}
