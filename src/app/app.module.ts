import { AppComponent } from './app.component';
import { CardComponent } from './components/card/card.component';
import { EditTicketComponent } from './components/dialogs/edit-ticket/edit-ticket.component';
import { BoardComponent } from './pages/board/board.component';

import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ToastrModule } from 'ngx-toastr';

import { MatAutocompleteModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatOptionModule, MatSelectModule, MatSidenavModule, MatToolbarModule } from '@angular/material';

@NgModule({
   declarations: [
      AppComponent,
      BoardComponent,
      EditTicketComponent,
      CardComponent
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
   ],
   entryComponents: [
      EditTicketComponent
   ],
   providers: [],
   bootstrap: [AppComponent]
})
export class AppModule { }
