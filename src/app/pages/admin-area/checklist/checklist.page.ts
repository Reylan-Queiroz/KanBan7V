import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ITreeOptions, TreeComponent } from 'angular-tree-component';
import { ToastrService } from 'ngx-toastr';
import { ChecklistService } from 'src/app/core/services/checklist.service';
import { ChecklistEtapasService } from 'src/app/core/services/checklistEtapas.service';
import { Checklist } from 'src/app/shared/models/checklist';
import { CheckListEtapa } from 'src/app/shared/models/checkListEtapa';
import { environment } from 'src/environments/environment';

@Component({
   selector: 'app-checklist',
   templateUrl: './checklist.page.html',
   styleUrls: ['./checklist.page.scss'],
})
export class ChecklistPage {
   form: FormGroup;
   //p
   @ViewChild(TreeComponent, { static: true }) private _tree: TreeComponent;

   checkListNameCtrl = new FormControl();

   options: ITreeOptions = {
      allowDrag: true,
      displayField: 'descricao',
   };

   options2: ITreeOptions = {
      displayField: 'descricao',
      allowDrag: (node) => node.isLeaf,
      allowDrop: (element, { parent, index }) => {
         return parent.hasChildren;
      }
   };

   itensCategorizados: CheckListEtapa[] = [];
   itensNaoCategorizados: CheckListEtapa[] = [];

   constructor(
      private _fb: FormBuilder,

      private _checklistService: ChecklistService,
      private _checklistEtapasService: ChecklistEtapasService,
      private _toastr: ToastrService,
   ) {
      this.form = this._fb.group({
         nomeTarefa: ['', Validators.compose([
            Validators.minLength(3),
            Validators.required,
         ])]
      });
   }

   addTarefa(form: FormGroup) {
      const nomeTarefa = form.value['nomeTarefa'][0].toUpperCase() + form.value['nomeTarefa'].substr(1);
      const id = this.itensCategorizados.length + this.itensNaoCategorizados.length + 1;

      let itemNaoCategorizado = new CheckListEtapa(id, nomeTarefa, [], null, 0, null);

      this.itensNaoCategorizados.push(itemNaoCategorizado);

      form.reset();

      this._tree.treeModel.update();
   }

   onSubmit() {
      this.itensCategorizados.forEach(checklistEtapa => {
         this._itemTemId(checklistEtapa);
      });

      const checklistName = this.checkListNameCtrl.value;
      const checklist = new Checklist(0, checklistName, this.itensCategorizados);

      this
         ._checklistService
         .createAll(checklist)
         .subscribe(() => {
            this._toastr.success('Sucesso!', '', environment.toastrConfig);
            this._limparCampos();
         }, err => console.log(err));
   }

   private _itemTemId(model) {
      if (model.id != 0)
         model.id = 0;

      for (let i = 0; i < model.children.length; i++) {
         const filho = model.children[i];

         if (filho)
            this._itemTemId(filho)
      }
   }

   private _limparCampos() {
      this.checkListNameCtrl.reset();
      this.form.reset();

      this.itensCategorizados = [];
      this.itensNaoCategorizados = [];
   }

   removerChecklistEtapa(node) {
      const index = this.itensNaoCategorizados.indexOf(node.data);

      if (index < 0) return;

      this.itensNaoCategorizados.splice(index, 1);

      this._tree.treeModel.update();
   }
}
