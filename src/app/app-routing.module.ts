import { AuthorizedGuard } from './core/guards/authorized.guard';
import { DashboardComponent } from './pages/admin-area/dashboard/dashboard.component';
import { BoardComponent } from './pages/board/board.component';
import { KanbanComponent } from './pages/kanban/kanban.component';
import { LoginComponent } from './pages/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DrawerComponent } from './shared/components/drawer/drawer.component';
import { ManagerGuard } from './core/guards/manager.guard';

const routes: Routes = [
   {
      path: '',
      canActivate: [AuthorizedGuard],
      children: [
         { path: '', component: BoardComponent },
         { path: 'quadros', component: BoardComponent },
         { path: 'kanban/:id', component: KanbanComponent }
      ],
      component: DrawerComponent
   },
   {
      path: 'dashboard',
      canActivate: [AuthorizedGuard, ManagerGuard],
      component: DashboardComponent
   },
   { path: 'login', component: LoginComponent },
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule]
})
export class AppRoutingModule { }
