import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DatePipe, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatBadgeModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatDialogModule, MatExpansionModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatOptionModule, MatProgressSpinnerModule, MatSelectModule, MatSidenavModule, MatTableModule, MatToolbarModule, MatTooltipModule, MatTreeModule, MAT_DATE_LOCALE } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorChromeModule } from 'ngx-color/chrome';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChangePasswordPage } from './pages/admin-area/change-password/change-password.page';
import { DashboardPage } from './pages/admin-area/dashboard/dashboard.page';
import { UserGroupDashboardComponent } from './pages/admin-area/dashboard/user-group-dashboard/user-group-dashboard.component';
import { UsersDashboardComponent } from './pages/admin-area/dashboard/users-dashboard/users-dashboard.component';
import { BoardPage } from './pages/board/board.page';
import { KanbanPage } from './pages/kanban/kanban.page';
import { LoginPage } from './pages/login/login.page';
import { CardTicketComponent } from './shared/components/card-ticket/card-ticket.component';
import { AddBoardDialog } from './shared/components/dialogs/board/add-board/add-board.dialog';
import { ColorPickerDialog } from './shared/components/dialogs/color-picker/color-picker.dialog';
import { AddTagDialog } from './shared/components/dialogs/tag/add-tag/add-tag.dialog';
import { AddTicketDialog } from './shared/components/dialogs/ticket/add-ticket/add-ticket.dialog';
import { DeleteTicketDialog } from './shared/components/dialogs/ticket/delete-ticket/delete-ticket.dialog';
import { EditTicketDialog } from './shared/components/dialogs/ticket/edit-ticket/edit-ticket.dialog';
import { TicketDatesComponent } from './shared/components/dialogs/ticket/edit-ticket/ticket-dates/ticket-dates.component';
import { TicketTransferComponent } from './shared/components/dialogs/ticket/edit-ticket/ticket-transfer/ticket-transfer.component';
import { AddUserGroupDialog } from './shared/components/dialogs/user/add-user-group/add-user-group.dialog';
import { AddUserDialog } from './shared/components/dialogs/user/add-user/add-user.dialog';
import { ChangePasswordDialog } from './shared/components/dialogs/user/change-password/change-password.dialog';
import { DrawerComponent } from './shared/components/drawer/drawer.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { ContentEditableFormDirective } from './shared/directives/content-editable-form.directive';
import { DisableDirective } from './shared/directives/disable.directive';
import { DndDirective } from './shared/directives/dnd.directive';
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
      ChangePasswordPage,

      //Components
      CardTicketComponent,
      DrawerComponent,
      NavbarComponent,
      UsersDashboardComponent,
      UserGroupDashboardComponent,
      TicketTransferComponent,
      TicketDatesComponent,

      //Dialogs
      EditTicketDialog,
      AddTicketDialog,
      DeleteTicketDialog,
      AddBoardDialog,
      ColorPickerDialog,
      AddTagDialog,
      AddUserDialog,
      AddUserGroupDialog,
      ChangePasswordDialog,

      //Pipes
      FilterPipe,

      //Directives
      DisableDirective,
      DndDirective,
      ContentEditableFormDirective,
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

      MatFormFieldModule,
      MatDialogModule,
      MatChipsModule,
      MatAutocompleteModule,
      MatInputModule,
      MatIconModule,
      MatCheckboxModule,
      MatMenuModule,
      MatCardModule,
      MatToolbarModule,
      MatSidenavModule,
      MatListModule,
      MatButtonModule,
      MatOptionModule,
      MatSelectModule,
      MatTooltipModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatExpansionModule,
      MatTreeModule,
      MatBadgeModule,
      MatProgressSpinnerModule,
      MatTableModule,

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
      ChangePasswordDialog
   ],
   providers: [
      DatePipe,

      { provide: LOCALE_ID, useValue: 'pt' },
      { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
   ],
   bootstrap: [AppComponent]
})
export class AppModule { }
