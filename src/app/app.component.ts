import { Component } from '@angular/core';

@Component({
   selector: 'app-root',
   template: '<router-outlet><ngx-spinner type="pacman" size="medium" color="#fff" [fullScreen]="true"><p style="color: white">Carregando...</p></ngx-spinner></router-outlet>'
})
export class AppComponent { }
