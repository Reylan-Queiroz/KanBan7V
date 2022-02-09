import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizedGuard } from './core/guards/authorized.guard';
import { ManagerGuard } from './core/guards/manager.guard';
import { DashboardPage } from './pages/admin-area/dashboard/dashboard.page';
import { BoardPage } from './pages/board/board.page';
import { KanbanPage } from './pages/kanban/kanban.page';
import { LoginPage } from './pages/login/login.page';
import { DrawerComponent } from './shared/components/drawer/drawer.component';

const routes: Routes = [
   {
      path: '',
      canActivate: [AuthorizedGuard],
      children: [
         { path: '', component: BoardPage },
         { path: 'quadros', component: BoardPage },
         { path: 'kanban/:id', component: KanbanPage }
      ],
      component: DrawerComponent
   },
   {
      path: 'dashboard',
      canActivate: [ManagerGuard],
      children: [
         { path: '', component: DashboardPage },
      ],
      component: DrawerComponent
   },
   { path: 'login', component: LoginPage },
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule]
})
export class AppRoutingModule { }
