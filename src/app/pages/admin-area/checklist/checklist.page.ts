import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ITreeOptions, TreeComponent } from 'angular-tree-component';
import { ChecklistService } from 'src/app/core/services/checklist.service';
import { ChecklistEtapasService } from 'src/app/core/services/checklistEtapas.service';
import { Checklist } from 'src/app/shared/models/checklist';
import { CheckListEtapa } from 'src/app/shared/models/checkListEtapa';
import { v4 } from 'uuid';

@Component({
   selector: 'app-checklist',
   templateUrl: './checklist.page.html',
   styleUrls: ['./checklist.page.scss'],
})
export class ChecklistPage {
   form: FormGroup;

   @ViewChild(TreeComponent, { static: true }) private _tree: TreeComponent;

   checkListNameCtrl = new FormControl();

   options: ITreeOptions = {
      allowDrag: (node) => node.isLeaf,
      getNodeClone: (node) => ({
         ...node.data,
         id: v4(),
         name: `copy of ${node.data.name}`
      }),

      displayField: 'descricao',
   };

   itensNaoCategorizados: CheckListEtapa[] = [];
   itensCategorizados: CheckListEtapa[] = [];

   constructor(
      private _fb: FormBuilder,

      private _checklistService: ChecklistService,
      private _checklistEtapasService: ChecklistEtapasService
   ) {
      this.form = this._fb.group({
         nomeTarefa: ['', Validators.compose([
            Validators.minLength(3),
            Validators.maxLength(25),
            Validators.required,
         ])]
      });

   }

   onMove(event) {
      let posicao = event.to.index;

      let checkListEtapaPai: CheckListEtapa = event.to.parent;
      let checkListEtapaFilho: CheckListEtapa = event.node;

      checkListEtapaFilho.posicao = posicao;

      console.log("Movido", checkListEtapaFilho.descricao, "para", checkListEtapaPai.descricao, "no index", event.to.index);
   }

   addTarefa(form: FormGroup) {
      let itemNaoCategorizado = new CheckListEtapa(0, form.value['nomeTarefa'], [], false, 0, new Date(), null);

      this.itensNaoCategorizados.push(itemNaoCategorizado);

      form.reset();

      this._tree.treeModel.update();
   }

   onSubmit() {
      const checklistName = this.checkListNameCtrl.value;
      const checklist = new Checklist(0, checklistName, '', this.itensCategorizados);

      this._checklistService
         .createAll(checklist)
         .subscribe(() => {

         }, err => console.log(err));
   }
}
