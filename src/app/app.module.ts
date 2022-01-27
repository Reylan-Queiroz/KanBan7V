import { NavbarDashboardComponent } from './pages/admin-area/dashboard/navbar-dashboard/navbar-dashboard.component';
import { DashboardComponent } from './pages/admin-area/dashboard/dashboard.component';
import { DisableDirective } from './shared/directives/disable.directive';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { ColorChromeModule } from 'ngx-color/chrome';
import { BoardComponent } from './pages/board/board.component';
import { KanbanComponent } from './pages/kanban/kanban.component';
import { LoginComponent } from './pages/login/login.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ToastrModule } from 'ngx-toastr';
import { MatAutocompleteModule, MatBadgeModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatDialogModule, MatExpansionModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatOptionModule, MatProgressSpinnerModule, MatSelectModule, MatSidenavModule, MatTableModule, MatToolbarModule, MatTooltipModule, MatTreeModule, MAT_DATE_LOCALE } from '@angular/material';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { DatePipe } from '@angular/common';
import { CardComponent } from './shared/components/card/card.component';
import { DrawerComponent } from './shared/components/drawer/drawer.component';
import { EditTicketComponent } from './shared/components/dialogs/ticket/edit-ticket/edit-ticket.component';
import { AddTicketComponent } from './shared/components/dialogs/ticket/add-ticket/add-ticket.component';
import { DeleteTicketComponent } from './shared/components/dialogs/ticket/delete-ticket/delete-ticket.component';
import { AddBoardComponent } from './shared/components/dialogs/board/add-board/add-board.component';
import { ColorPickerComponent } from './shared/components/dialogs/color-picker/color-picker.component';
import { AddTagComponent } from './shared/components/dialogs/tag/add-tag/add-tag.component';
import { FilterPipe } from './shared/pipes/filter.pipe';
import { AddUserComponent } from './shared/components/dialogs/user/add-user/add-user.component';

@NgModule({
   declarations: [
      AppComponent,

      //Pages
      KanbanComponent,
      LoginComponent,
      BoardComponent,
      DashboardComponent,

      //Components
      CardComponent,
      DrawerComponent,
      LoadingComponent,
      NavbarDashboardComponent,

      //Dialogs
      EditTicketComponent,
      AddTicketComponent,
      DeleteTicketComponent,
      AddBoardComponent,
      ColorPickerComponent,
      AddTagComponent,
      AddUserComponent,

      //Pipes
      FilterPipe,

      //Directives
      DisableDirective,
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      NoopAnimationsModule,
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule,
      BrowserAnimationsModule,
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
      MatOptionModule,
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
   ],
   entryComponents: [
      EditTicketComponent,
      AddTicketComponent,
      DeleteTicketComponent,
      AddBoardComponent,
      ColorPickerComponent,
      AddTagComponent,
      AddUserComponent
   ],
   providers: [
      { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
      DatePipe,
   ],
   bootstrap: [AppComponent]
})
export class AppModule { }
