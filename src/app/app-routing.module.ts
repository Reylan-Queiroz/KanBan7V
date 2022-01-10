import { DrawerComponent } from './components/drawer/drawer.component';
import { BoardComponent } from './pages/board/board.component';
import { KanbanComponent } from './pages/kanban/kanban.component';
import { LoginComponent } from './pages/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';

const routes: Routes = [
   {
      path: '',
      canActivate: [AuthService],
      children: [
         { path: '', component: BoardComponent },
         { path: 'quadros', component: BoardComponent },
         { path: 'kanban', component: KanbanComponent }
      ],
      component: DrawerComponent
   },

   { path: 'login', component: LoginComponent },
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule]
})
export class AppRoutingModule { }
