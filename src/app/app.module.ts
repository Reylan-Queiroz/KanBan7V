import { AddTagComponent } from './components/dialogs/add-tag/add-tag.component';
import { ColorChromeModule } from 'ngx-color/chrome';
import { ColorPickerComponent } from './components/dialogs/color-picker/color-picker.component';
import { AddBoardComponent } from './components/dialogs/board/add-board/add-board.component';
import { DrawerComponent } from './components/drawer/drawer.component';
import { BoardComponent } from './pages/board/board.component';
import { KanbanComponent } from './pages/kanban/kanban.component';
import { LoginComponent } from './pages/login/login.component';
import { AppComponent } from './app.component';
import { CardComponent } from './components/card/card.component';
import { EditTicketComponent } from './components/dialogs/ticket/edit-ticket/edit-ticket.component';

import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ToastrModule } from 'ngx-toastr';

import { MatAutocompleteModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatOptionModule, MatSelectModule, MatSidenavModule, MatToolbarModule, MatTooltipModule } from '@angular/material';
import { AddTicketComponent } from './components/dialogs/ticket/add-ticket/add-ticket.component';
import { DeleteTicketComponent } from './components/dialogs/ticket/delete-ticket/delete-ticket.component';

@NgModule({
   declarations: [
      AppComponent,
      KanbanComponent,
      LoginComponent,
      BoardComponent,

      CardComponent,
      DrawerComponent,

      EditTicketComponent,
      AddTicketComponent,
      DeleteTicketComponent,
      AddBoardComponent,
      ColorPickerComponent,
      AddTagComponent
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

      MatDialogModule,
      MatChipsModule,
      MatFormFieldModule,
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
      MatOptionModule
   ],
   entryComponents: [
      EditTicketComponent,
      AddTicketComponent,
      DeleteTicketComponent,
      AddBoardComponent,
      ColorPickerComponent,
      AddTagComponent
   ],
   providers: [],
   bootstrap: [AppComponent]
})
export class AppModule { }
