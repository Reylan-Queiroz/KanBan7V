import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { DragulaModule } from 'ng2-dragula';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { TodoListComponent } from './pages/todo-list/todo-list.component';
import { EditTicketComponent } from './pages/shared/dialogs/edit-ticket/edit-ticket.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatIconModule, MatNativeDateModule, MatRadioButton, MatRadioModule, MatSlideToggleModule } from '@angular/material';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
   declarations: [
      AppComponent,
      TodoListComponent,
      EditTicketComponent,
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      NoopAnimationsModule,
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule,
      DragulaModule.forRoot(),
      BrowserAnimationsModule,
      ToastrModule.forRoot(),

      MatDialogModule,
      MatChipsModule,
      MatFormFieldModule,
      MatAutocompleteModule,
      MatInputModule,
      MatIconModule,
      MatDatepickerModule,
      MatDatepickerModule,
      MatButtonModule,
      MatFormFieldModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatSlideToggleModule,
      MatCheckboxModule,
      MatRadioModule
   ],
   entryComponents: [
      EditTicketComponent
   ],
   providers: [],
   bootstrap: [AppComponent]
})
export class AppModule { }
