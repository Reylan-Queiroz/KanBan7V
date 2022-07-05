import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Conversation } from 'src/app/shared/models/conversation';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';

@Injectable({
   providedIn: 'root'
})
export class ConversationService extends BaseService<Conversation, number> {
   constructor(protected _http: HttpClient) {
      super(_http, `${environment.api.baseUrl}/Conversation`);
   }
}
