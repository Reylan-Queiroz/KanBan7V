import { AppComponent } from './app.component';
import { EditTicketComponent } from './components/dialogs/edit-ticket/edit-ticket.component';
import { BoardComponent } from './pages/board/board.component';

import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { DragulaModule } from 'ng2-dragula';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ToastrModule } from 'ngx-toastr';

import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule, MatIconModule, MatMenuModule } from '@angular/material';

@NgModule({
   declarations: [
      AppComponent,
      BoardComponent,
      EditTicketComponent,
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      NoopAnimationsModule,
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule,
      DragulaModule.forRoot(),
      BrowserAnimationsModule,
      ToastrModule.forRoot(),
      DragDropModule,

      MatDialogModule,
      MatChipsModule,
      MatFormFieldModule,
      MatAutocompleteModule,
      MatInputModule,
      MatIconModule,
      MatCheckboxModule,
      MatMenuModule
   ],
   entryComponents: [
      EditTicketComponent
   ],
   providers: [],
   bootstrap: [AppComponent]
})
export class AppModule { }
