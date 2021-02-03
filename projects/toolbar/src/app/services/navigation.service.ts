import { Injectable } from '@angular/core';

import { MessageBus } from '@shared/message-bus';
import { MessageCode } from '@scripts/messages';
import { AppRoute as CharonAppRoute } from '@charon/app-route';
import { HubRoute as CharonHubRoute } from '@charon/hub';

@Injectable()
export class NavigationService {
  private readonly messageBus = new MessageBus();

  public closeApp(): void {
    this.messageBus.sendMessage(MessageCode.ToolbarClose);
  }

  public openCharonHubFeed(): void {
    this.messageBus.sendMessage(MessageCode.Navigate, [
      CharonAppRoute.Hub,
      CharonHubRoute.Feed,
    ]);
  }

  public openCharonHubOverview(): void {
    this.messageBus.sendMessage(MessageCode.Navigate, [
      CharonAppRoute.Hub,
    ]);
  }
}
