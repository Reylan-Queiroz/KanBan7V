import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DatePipe, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TreeModule } from 'angular-tree-component';
import { ColorChromeModule } from 'ngx-color/chrome';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChecklistPage } from './pages/admin-area/checklist/checklist.page';
import { DashboardPage } from './pages/admin-area/dashboard/dashboard.page';
import { UserGroupDashboardComponent } from './pages/admin-area/dashboard/user-group-dashboard/user-group-dashboard.component';
import { UsersDashboardComponent } from './pages/admin-area/dashboard/users-dashboard/users-dashboard.component';
import { BoardPage } from './pages/board/board.page';
import { KanbanPage } from './pages/kanban/kanban.page';
import { LoginPage } from './pages/login/login.page';
import { CardTicketComponent } from './shared/components/card-ticket/card-ticket.component';
import { AddBoardDialog } from './shared/components/dialogs/board/add-board/add-board.dialog';
import { AddChecklistDialog } from './shared/components/dialogs/checklist/add-checklist/add-checklist.dialog';
import { ColorPickerDialog } from './shared/components/dialogs/color-picker/color-picker.dialog';
import { AddTagDialog } from './shared/components/dialogs/tag/add-tag/add-tag.dialog';
import { AddTicketDialog } from './shared/components/dialogs/ticket/add-ticket/add-ticket.dialog';
import { DeleteTicketDialog } from './shared/components/dialogs/ticket/delete-ticket/delete-ticket.dialog';
import { EditTicketDialog } from './shared/components/dialogs/ticket/edit-ticket/edit-ticket.dialog';
import { TicketDatesComponent } from './shared/components/dialogs/ticket/edit-ticket/ticket-dates/ticket-dates.component';
import { TicketTransferComponent } from './shared/components/dialogs/ticket/edit-ticket/ticket-transfer/ticket-transfer.component';
import { AddUserGroupDialog } from './shared/components/dialogs/user/add-user-group/add-user-group.dialog';
import { AddUserDialog } from './shared/components/dialogs/user/add-user/add-user.dialog';
import { MudarSenhaComponent } from './shared/components/dialogs/user/mudar-senha/mudar-senha.component';
import { DrawerComponent } from './shared/components/drawer/drawer.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { DndDirective } from './shared/directives/dnd.directive';
import { MaterialModule } from './shared/material.module';
import { FilterPipe } from './shared/pipes/filter.pipe';

registerLocaleData(localePt, 'pt');

@NgModule({
   declarations: [
      AppComponent,

      //Pages
      KanbanPage,
      LoginPage,
      BoardPage,
      DashboardPage,
      ChecklistPage,

      //Components
      CardTicketComponent,
      DrawerComponent,
      NavbarComponent,
      UsersDashboardComponent,
      UserGroupDashboardComponent,
      TicketTransferComponent,
      TicketDatesComponent,
      MudarSenhaComponent,

      //Dialogs
      EditTicketDialog,
      AddTicketDialog,
      DeleteTicketDialog,
      AddBoardDialog,
      ColorPickerDialog,
      AddTagDialog,
      AddUserDialog,
      AddUserGroupDialog,
      AddChecklistDialog,

      //Pipes
      FilterPipe,

      //Directives
      DndDirective
   ],
   imports: [
      BrowserModule,
      BrowserAnimationsModule,
      AppRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule,
      ToastrModule.forRoot(),
      DragDropModule,
      ColorChromeModule,
      TreeModule.forRoot(),

      MaterialModule,

      NgxMatDatetimePickerModule,
      NgxMatTimepickerModule,
      NgxMatNativeDateModule,
      NgxSpinnerModule
   ],
   entryComponents: [
      EditTicketDialog,
      AddTicketDialog,
      DeleteTicketDialog,
      AddBoardDialog,
      ColorPickerDialog,
      AddTagDialog,
      AddUserDialog,
      AddUserGroupDialog,
      AddChecklistDialog,
      MudarSenhaComponent
   ],
   providers: [
      DatePipe,

      { provide: LOCALE_ID, useValue: 'pt-BR' },
      { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
   ],
   exports: [
      DndDirective
   ],
   bootstrap: [AppComponent]
})
export class AppModule { }
